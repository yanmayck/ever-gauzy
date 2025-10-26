import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { AccountRegistrationEvent } from '@gauzy/core';
import { BillingService } from '../billing.service';
import { Logger } from '@nestjs/common';

@EventsHandler(AccountRegistrationEvent)
export class AccountRegistrationHandler implements IEventHandler<AccountRegistrationEvent> {
    private readonly logger = new Logger(AccountRegistrationHandler.name);

    constructor(
        private readonly billingService: BillingService
    ) {}

    async handle(event: AccountRegistrationEvent) {
        const { user } = event;

        // Billing is tied to the tenant (organization), not the individual user.
        if (user.tenantId && process.env.REQUIRE_SUBSCRIPTION === 'true') {
            this.logger.log(`New account registration for tenant ${user.tenantId}. Creating trial subscription.`);
            try {
                await this.billingService.createTrialSubscription(user.tenantId);
            } catch (error) {
                this.logger.error(`Failed to create trial subscription for tenant ${user.tenantId}`, error);
            }
        }
    }
}
