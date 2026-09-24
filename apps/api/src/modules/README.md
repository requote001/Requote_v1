# Domain modules

Each module owns its controllers, application services, domain rules, and persistence adapters. Cross-module communication should use explicit service contracts or domain events rather than reaching into another module's tables.
