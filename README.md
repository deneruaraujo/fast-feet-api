## Functional Requirements
 - [x] The application must have two types of users: deliveryman or admin.
 - [x] It should be possible to log in with SSN and Password.
 - [x] CRUD operations must be available for deliverymans.
 - [x] CRUD operations must be available for orders.
 - [x] CRUD operations must be available for recipients.
 - [x] It should be possible to mark an order as awaiting (available for pickup).
 - [x] It should be possible to pick up an order.
 - [x] It should be possible to mark an order as delivered.
 - [x] It should be possible to mark an order as returned.
 - [x] It should be possible to list orders with delivery addresses near the deliveryman's location.
 - [x] It should be possible to change a user's password.
 - [x] It should be possible to list a user's deliveries.
 - [x] Recipients should be notified of any changes in the order status.


## Business Requirements
 - [x] Only admin users can perform CRUD operations on deliverymans.
 - [x] Only admin users can perform CRUD operations on orders.
 - [x] Only admin users can perform CRUD operations on recipients.
 - [x] To mark an order as delivered, a photo must be mandatory.
 - [x] Only the deliveryman who picked up the order can mark it as delivered.
 - [x] Only the admin can change a user's password.
 - [x] A deliveryman should not be able to list the orders of another deliveryman.

 ## Non-functional Requirements
- [x] Password must be encrypted;
- [x] Users must be identified by a JWT;
- [x] All data lists must be paginated with 20 items per page.