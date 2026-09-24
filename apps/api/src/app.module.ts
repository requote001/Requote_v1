import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { HealthModule } from "./health/health.module";
import { AnalyticsModule } from "./modules/analytics/analytics.module";
import { AgreementsModule } from "./modules/agreements/agreements.module";
import { AiModule } from "./modules/ai/ai.module";
import { DealsModule } from "./modules/deals/deals.module";
import { FulfillmentModule } from "./modules/fulfillment/fulfillment.module";
import { IdentityModule } from "./modules/identity/identity.module";
import { MatchingModule } from "./modules/matching/matching.module";
import { MessagingModule } from "./modules/messaging/messaging.module";
import { NegotiationsModule } from "./modules/negotiations/negotiations.module";
import { NotificationsModule } from "./modules/notifications/notifications.module";
import { OffersModule } from "./modules/offers/offers.module";
import { PaymentsModule } from "./modules/payments/payments.module";
import { ProfilesModule } from "./modules/profiles/profiles.module";
import { RequestsModule } from "./modules/requests/requests.module";
import { SettingsModule } from "./modules/settings/settings.module";
import { TrustModule } from "./modules/trust/trust.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HealthModule,
    IdentityModule,
    ProfilesModule,
    RequestsModule,
    MatchingModule,
    OffersModule,
    NegotiationsModule,
    MessagingModule,
    AgreementsModule,
    DealsModule,
    PaymentsModule,
    FulfillmentModule,
    NotificationsModule,
    TrustModule,
    AiModule,
    AnalyticsModule,
    SettingsModule,
  ],
})
export class AppModule {}
