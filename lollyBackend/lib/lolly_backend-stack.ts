import * as cdk from '@aws-cdk/core';
import * as appsync from '@aws-cdk/aws-appsync';
import * as ddb from '@aws-cdk/aws-dynamodb';
import * as lambda from '@aws-cdk/aws-lambda';
import * as events from "@aws-cdk/aws-events";
import * as targets from "@aws-cdk/aws-events-targets";
import { Rule } from '@aws-cdk/aws-events';
import { requestTemplate, responseTemplate } from '../utils/appsync-request-response';
import * as s3 from '@aws-cdk/aws-s3'
import * as s3Deployment from '@aws-cdk/aws-s3-deployment'
import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as origins from '@aws-cdk/aws-cloudfront-origins';
import * as CodePipeline from '@aws-cdk/aws-codepipeline'
import * as CodePipelineAction from '@aws-cdk/aws-codepipeline-actions'
import * as CodeBuild from '@aws-cdk/aws-codebuild'
import { PolicyStatement } from '@aws-cdk/aws-iam';

export class LollyBackendStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    //Deploy Gatsby on s3 bucket
    const lollywebBucket = new s3.Bucket(this, "lollyWebsiteBucket", {
      versioned: true,
    });

    const distribution = new cloudfront.Distribution(this, "Distribution", {
      defaultBehavior: {
        origin: new origins.S3Origin(lollywebBucket),
      },
      defaultRootObject: "index.html",
    });

    // Prints out the web endpoint to the terminal
    new cdk.CfnOutput(this, "DistributionDomainName", {
      value: distribution.domainName,
    });

    // housekeeping for uploading the data in bucket 
    new s3Deployment.BucketDeployment(this, "DeployWebsite", {
      sources: [s3Deployment.Source.asset("../frontend/public")],
      destinationBucket: lollywebBucket,
      distribution,
      distributionPaths: ["/*"],
    });

    // API
    const api = new appsync.GraphqlApi(this, 'vlollyApi', {
      name: 'Lolly-14C',
      schema: appsync.Schema.fromAsset('schema/schema.gql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
        },
      },
      xrayEnabled: true,
    });


    // Create new DynamoDB Table 
    const lollyTable = new ddb.Table(this, "lollyApp", {
      tableName: "Virtual-Lolly",
      billingMode: ddb.BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: "id",
        type: ddb.AttributeType.STRING,
      },
    });

    // DYANAMO AS DS
    const ddbAsDS = api.addDynamoDbDataSource("theLollyTable", lollyTable);

    ddbAsDS.createResolver({
      typeName: "Query",
      fieldName: "listLolly",
      requestMappingTemplate: appsync.MappingTemplate.dynamoDbScanTable(),
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultList(),
    })

    // HTTP DATASOURCE
    const httpDs = api.addHttpDataSource(
      "ds",
      "https://events." + this.region + ".amazonaws.com",
      {
        name: "httpsWithEventBridge",
        description: "From appsync to EventBridge",
        authorizationConfig: {
          signingRegion: this.region,
          signingServiceName: "events",
        },
      });
    events.EventBus.grantPutEvents(httpDs);

    // RESOLVERS
    const mutations = ["createLolly"]

    mutations.forEach((mut) => {
      let details = `\\\"id\\\": \\\"$ctx.args.id\\\"`;

      if (mut === "createLolly") {
        details = `\\\"c1\\\":\\\"$ctx.args.vlolly.c1\\\" , \\\"c2\\\":\\\"$ctx.args.vlolly.c2\\\" , \\\"c3\\\":\\\"$ctx.args.vlolly.c3\\\" ,\\\"rec\\\":\\\"$ctx.args.vlolly.rec\\\" ,\\\"sender\\\":\\\"$ctx.args.vlolly.sender\\\" , \\\"message\\\":\\\"$ctx.args.vlolly.message\\\" , \\\"path\\\":\\\"$ctx.args.vlolly.path\\\"`;
      }

      httpDs.createResolver({
        typeName: "Mutation",
        fieldName: mut,
        requestMappingTemplate: appsync.MappingTemplate.fromString(requestTemplate(details, mut)),
        responseMappingTemplate: appsync.MappingTemplate.fromString(responseTemplate()),
      });
    });


    // Lambda function
    const virtualLolly_lambda = new lambda.Function(this, 'virtualLolly_Lambda', {
      functionName: "LollyApp-14C",
      code: lambda.Code.fromAsset("lambda"),
      handler: "index.handler",
      runtime: lambda.Runtime.NODEJS_12_X,
      environment: {
        DYNAMO_TABLE_NAME: lollyTable.tableName,
      },
    });
    lollyTable.grantReadWriteData(virtualLolly_lambda)
    lollyTable.grantFullAccess(virtualLolly_lambda)

    // RULE
    const rule = new Rule(this, "the-Ruleee", {
      ruleName: "ruleForAppsyncWithLollyApp",
      eventPattern: {
        source: ["LollyAppEvents"],
      },
    });

    //adding target 
    rule.addTarget(new targets.LambdaFunction(virtualLolly_lambda));



    // CODEPIPELINE
    // Artifact from source stage
    const source_Output = new CodePipeline.Artifact();

    // // Artifact from build stage
    const S3_Output = new CodePipeline.Artifact();

    //Code build action, Here you will define a complete build
    const s3build = new CodeBuild.PipelineProject(this, 's3build', {
      buildSpec: CodeBuild.BuildSpec.fromObject({
        version: '0.2',
        phases: {
          install: {
            "runtime-versions": {
              "nodejs": 12
            },
            commands: [
              'cd frontend',
              'npm i -g gatsby',
              'npm install',
            ],
          },
          build: {
            commands: [
              'gatsby build',
            ],
          },
        },
        artifacts: {
          'base-directory': './frontend/public',   ///outputting our generated Gatsby Build files to the public directory
          "files": [
            '**/*'
          ]
        },
      }),
      environment: {
        buildImage: CodeBuild.LinuxBuildImage.STANDARD_3_0,   ///BuildImage version 3 because we are using nodejs environment 12
      },
    });

    // PERMISSIONS
    const policy = new PolicyStatement();
    policy.addActions('s3:*');
    policy.addResources('*');

    s3build.addToRolePolicy(policy);

    const pipeline = new CodePipeline.Pipeline(this, 'lollyPipeline', {
      pipelineName: "LollyPipeline",
      crossAccountKeys: false,
      restartExecutionOnUpdate: true,
    });
    rule.addTarget(new targets.CodePipeline(pipeline));

    pipeline.addStage({
      stageName: 'Source',
      actions: [
        new CodePipelineAction.GitHubSourceAction({
          actionName: 'github_source',
          owner: 'jawwad-ali',
          repo: "Virtual-Lolly-AWS-CDK-14C-Again",
          oauthToken: cdk.SecretValue.plainText("f3232d3c706d24352bfe2db2e2b91c00080609ea"),
          output: source_Output,
          branch: "master",
        })
      ],
    })

    pipeline.addStage({
      stageName: 'build',
      actions: [
        new CodePipelineAction.CodeBuildAction({
          actionName: 's3Build',
          project: s3build,
          input: source_Output,
          outputs: [S3_Output],
        }),
      ],
    })

    pipeline.addStage({
      stageName: 'deploy',
      actions: [
        new CodePipelineAction.S3DeployAction({
          actionName: 's3Build',
          input: S3_Output,
          bucket: lollywebBucket,
        }),
      ],
    })
  }
}