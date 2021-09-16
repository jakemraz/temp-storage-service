#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { TempStorageServiceStack } from '../stack/temp-storage-service-stack';
import { AppContext } from '../lib/app-context';

const app = new cdk.App();
const env = app.node.tryGetContext("env")==undefined?'dev':app.node.tryGetContext("env");

AppContext.getInstance().initialize({
    applicationName: 'temp-storage-service',
    deployEnvironment: env,
});

new TempStorageServiceStack(app, `TempStorageServiceStack${env}`);
