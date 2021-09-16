import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as TempStorageService from '../stack/temp-storage-service-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new TempStorageService.TempStorageBackendStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
