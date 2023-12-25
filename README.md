## Functional Requirements
 - [x] The application must have two types of users: deliveryman or admin.
 - [] It should be possible to log in with SSN and Password.
 - [x] CRUD operations must be available for deliverymans.
 - [x] CRUD operations must be available for orders.
 - [x] CRUD operations must be available for recipients.
 - [] It should be possible to mark an order as awaiting (available for pickup).
 - [] It should be possible to pick up an order.
 - [] It should be possible to mark an order as delivered.
 - [] It should be possible to mark an order as returned.
 - [] It should be possible to list orders with delivery addresses near the deliveryman's location.
 - [x] It should be possible to change a user's password.
 - [] It should be possible to list a user's deliveries.
 - [] Recipients should be notified of any changes in the order status.


## Business Requirements
 - [x] Only admin users can perform CRUD operations on deliverymans.
 - [x] Only admin users can perform CRUD operations on orders.
 - [x] Only admin users can perform CRUD operations on recipients.
 - [] To mark an order as delivered, a photo must be mandatory.
 - [] Only the deliveryman who picked up the order can mark it as delivered.
 - [x] Only the admin can change a user's password.
 - [] A deliveryman should not be able to list the orders of another deliveryman.

 ## Non-functional Requirements
- [x] Password must be encrypted;
- [] Users must be identified by a JWT;
- [] All data lists must be paginated with 40 items per page.