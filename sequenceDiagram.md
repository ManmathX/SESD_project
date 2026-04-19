# E-Commerce Architecture - Sequence Diagram

This Sequence Diagram maps out the complex, end-to-end data flow that fires asynchronously when a user places a checkout order. 

Notice how the `OrderService` delegates background processing to the `EventBus` to prevent hanging the initial HTTP response thread.

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant React UI
    participant OrderController
    participant AuthMiddleware
    participant OrderService
    participant EventBus
    participant OrderRepository
    participant Database

    User->>React UI: Clicks "Checkout"
    React UI->>OrderController: POST /api/orders (token, items)
    
    OrderController->>AuthMiddleware: verifyToken()
    activate AuthMiddleware
    AuthMiddleware-->>OrderController: Valid (Injects userId)
    deactivate AuthMiddleware

    OrderController->>OrderService: placeOrder(userId, items)
    activate OrderService
    
    OrderService->>OrderRepository: create({ userId, items, total })
    activate OrderRepository
    OrderRepository->>Database: mongoose.save()
    Database-->>OrderRepository: Inserted OrderDoc
    OrderRepository-->>OrderService: Order Created
    deactivate OrderRepository

    OrderService-)EventBus: publish('OrderPlacedEvent', orderId)
    OrderService-->>OrderController: Checkout Success Payload
    deactivate OrderService
    
    OrderController-->>React UI: HTTP 201 OK (Order Details)
    React UI-->>User: "Order Successful!"

    %% Background processing
    note over EventBus: Handlers process email receipts or inventory deduction asynchronously in the background.
```
