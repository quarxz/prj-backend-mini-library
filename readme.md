prj-backend-mini-library (Faslk GitHub)

prj-frontend-mini-library (Oleski GitHub)

Data Object Array:

User:

- Name -> email

- Password

  ----> UserId

Authors:

- Name

  ----> authorId

Books:

- Title
- Author : reference -> authorId
- Year
- ISBN

  ----> bookId

user_books:

- User : reference -> userId
- Books --> [bookIds]
