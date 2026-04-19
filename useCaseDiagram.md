# E-Commerce Architecture - Use Case Diagram

The following Use Case Diagram illustrates the distinct actions available to the two primary actors inside the system: the standard **Customer** and the elevated **Admin**.

```mermaid
usecaseDiagram
direction LR

actor Customer
actor Admin

package NexusShop {
    usecase "Register Account" as UC1
    usecase "Login" as UC2
    usecase "Browse Products" as UC3
    usecase "Add to Cart" as UC4
    usecase "Checkout/Place Order" as UC5
    usecase "View Order History" as UC6
    
    usecase "Manage Inventory" as UC7
    usecase "Add New Product" as UC8
    usecase "Delete/Update Product" as UC9
}

Customer --> UC1
Customer --> UC2
Customer --> UC3
Customer --> UC4
Customer --> UC5
Customer --> UC6

Admin --> UC2
Admin --> UC3
Admin --> UC7

UC7 ..> UC8 : <<includes>>
UC7 ..> UC9 : <<includes>>
```
