npx drizzle-kit introspect

dbdiagram.io

mutation Signup($email: String!, $password: String!, $name: String!) {
  signup(email: $email, password: $password, name: $name) {
    token
    user {
      id
      email
      name
      createdAt
    }
  }
}

mutation {
  login(email: "test@example.com", password: "password123") {
    token
    user {
      id
      email
      name
    }
  }
}

query {
  me {
    id
    email
    name
  }
} 