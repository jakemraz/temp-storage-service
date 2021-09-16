import * as cdk from '@aws-cdk/core';
import * as apigw from '@aws-cdk/aws-apigateway';
import * as ddb from '@aws-cdk/aws-dynamodb';
import * as lambda from '@aws-cdk/aws-lambda';
import * as path from 'path';
import { AppContext } from '../lib/app-context';

export class TempStorageServiceStack extends cdk.Stack {

  private readonly table: ddb.ITable;

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const env = AppContext.getInstance().env;

    this.table = new ddb.Table(this, 'TempStorageServiceTable', {
      tableName: `TempStorageServiceTable${env}`,
      partitionKey: { name: 'key', type: ddb.AttributeType.STRING },
      timeToLiveAttribute: 'TTL',
    });

    const api = new apigw.RestApi(this, 'TempStorageServiceApi');

    const setValue = this.createLambdaFunction('SetValue', 'set_value.handler', );
    const getValue = this.createLambdaFunction('GetValue', 'get_value.handler');
    this.table.grantFullAccess(setValue);
    this.table.grantReadData(getValue);
    
    api.root.addMethod('POST', new apigw.LambdaIntegration(setValue));
    api.root.addMethod('GET', new apigw.LambdaIntegration(getValue));
    
  }

  private createLambdaFunction(id: string, handler: string) {
    return new lambda.Function(this, id, {
      code: lambda.Code.fromAsset(path.resolve(__dirname, '..', 'functions')),
      runtime: lambda.Runtime.PYTHON_3_8,
      handler,
      environment: {
        TEMP_STORAGE_TABLE: this.table.tableName
      },
    });
  }
}
