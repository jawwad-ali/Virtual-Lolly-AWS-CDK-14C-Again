#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { LollyBackendStack } from '../lib/lolly_backend-stack';

const app = new cdk.App();
new LollyBackendStack(app, 'LollyBackendStack');
