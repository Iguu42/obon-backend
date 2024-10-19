export const getUserEventsSchema = {
    description: "Obter todos os eventos do usuário",
    tags: ["Users"],
    response: {
      404: {
        type: "object",
        properties: {
          message: { type: "string" }
        }
      }
    }
  };
  
  export const getUserSchema = {
    description: "Obter informações do usuário",
    tags: ["Users"],
    response: {
      200: {
        type: "object",
        properties: {
          id: { type: "string" },
          externalId: {type: "string"},
          firstName: {type: "string"},
          lastName: {type: "string"},
          email: { type: "string" },
          phone: {type: "string"},
          cpf: {type: "string"}
        }
      },
      404: {
        type: "object",
        properties: {
          message: { type: "string" }
        }
      }
    }
  };
  
  export const updateUserSchema = {
    description: "Atualizar informações do usuário",
    tags: ["Users"],
    body: {
      type: "object",
      properties: {
        cpf: { type: "string" },
        phone: { type: "string" }
      },
      required: ["cpf", "phone"]
    },
    response: {
      200: {
        type: "object",
        properties: {
          id: { type: "string" },
          externalId: { type: "string" },
          firstName: { type: "string" },
          lastName: { type: "string" },
          email: { type: "string" },
          phone: { type: "string" },
          cpf: { type: "string" },
        }
      },
      400: {
        type: "object",
        properties: {
          message: { type: "string" }
        }
      }
    }
  };
  