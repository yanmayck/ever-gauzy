import { ApplicationPluginConfig, ApplicationPluginInterface } from '@gauzy/common';
import { BillingModule } from './billing.module';

export class BillingPlugin implements ApplicationPluginInterface {
  constructor(private readonly config: ApplicationPluginConfig) {}

  async bootstrap(pluginConfig: ApplicationPluginConfig) {
    console.log('BillingPlugin is being bootstrapped...');

    // Add billing middleware to the API config
    pluginConfig.apiConfigOptions.middleware.push('billing.middleware');

    // Add billing module to the plugins array
    pluginConfig.plugins.push(BillingModule);

    console.log('BillingPlugin bootstrapped successfully');
  }
}