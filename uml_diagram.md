# E-Commerce Architecture Diagram



## Mermaid Diagram

You can also view this architecture right now! Just drop this Mermaid code into a tool like [Mermaid Live Editor](https://mermaid.live/), or use it in GitHub markdown files directly.

```mermaid
classDiagram
    %% Core Interfaces
    class IRepository~T~ {
        <<interface>>
        +create(item: Partial~T~): Promise~T~
        +findById(id: string): Promise~T | null~
        +findAll(filters?: any): Promise~T[]~
        +update(id: string, item: Partial~T~): Promise~T | null~
        +delete(id: string): Promise~boolean~
    }

    class IEventBus {
        <<interface>>
        +publish(event: DomainEvent): Promise~void~
        +subscribe(eventName: string, handler: Function): void
    }

    %% Shared Space
    class DatabaseConnection {
        <<Singleton>>
        +connect(uri: string): Promise~void~
        +disconnect(): Promise~void~
    }

    class EventBus {
        <<Singleton>>
        -listeners: Map
        +publish(event)
        +subscribe(eventName, handler)
    }
    IEventBus <|.. EventBus : implements

    class AuthMiddleware {
        +verify(req, res, next)
        +requireAdmin(req, res, next)
    }

    %% Auth Service
    class UserRepository {
        +findByEmail(email: string): Promise~IUser | null~
    }
    IRepository <|.. UserRepository : implements~IUser~

    class AuthService {
        -userRepo: UserRepository
        +register(name, email, password)
        +login(email, password)
    }
    AuthService --> UserRepository : uses

    class AuthController {
        -authService: AuthService
    }
    AuthController --> AuthService : delegates

    %% Catalog Service
    class ProductRepository { }
    IRepository <|.. ProductRepository : implements~IProduct~

    class ProductService {
        -productRepo: ProductRepository
        -eventBus: IEventBus
        +createProduct(...)
    }
    ProductService --> ProductRepository : uses
    ProductService --> IEventBus : publishes Event

    class ProductController {
        -productService: ProductService
    }
    ProductController --> ProductService : delegates

    %% Order Service
    class OrderRepository {
        +findByUserId(userId: string)
    }
    IRepository <|.. OrderRepository : implements~IOrder~

    class OrderService {
        -orderRepo: OrderRepository
        -eventBus: IEventBus
        +placeOrder(userId, items)
    }
    OrderService --> OrderRepository : uses
    OrderService --> IEventBus : publishes Event

    %% HTTP Server Root
    class ApplicationRoot {
        -ExpressApp
        +configureRoutes()
        +start()
    }
    ApplicationRoot --> AuthController : sets HTTP routes
    ApplicationRoot --> ProductController : sets HTTP routes
    ApplicationRoot --> OrderController : sets HTTP routes
```
