## Functional Requirements
 - [] The application must have two types of users: delivery person and/or admin.
 - [] It should be possible to log in with CPF and Password.
 - [] CRUD operations must be available for delivery persons.
 - [] CRUD operations must be available for orders.
 - [] CRUD operations must be available for recipients.
 - [] It should be possible to mark an order as awaiting (available for pickup).
 - [] It should be possible to pick up an order.
 - [] It should be possible to mark an order as delivered.
 - [] It should be possible to mark an order as returned.
 - [] It should be possible to list orders with delivery addresses near the delivery person's location.
 - [] It should be possible to change a user's password.
 - [] It should be possible to list a user's deliveries.
 - [] Recipients should be notified of any changes in the order status.


## Business Requirements
 - [] Only admin users can perform CRUD operations on orders.
 - [] Only admin users can perform CRUD operations on delivery persons.
 - [] Only admin users can perform CRUD operations on recipients.
 - [] To mark an order as delivered, a photo must be mandatory.
 - [] Only the delivery person who picked up the order can mark it as delivered.
 - [] Only the admin can change a user's password.
 - [] A delivery person should not be able to list the orders of another delivery person.

 ## Non-functional Requirements
- [] Password must be encrypted;
- [] Users must be identified by a JWT;
- [] All data lists must be paginated with 40 items per page.