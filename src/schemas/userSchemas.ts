export const getUserEventsSchema = {
    description: "Obter todos os eventos do usuário",
    tags: ["Users"],
    response: {
      200: {
        type: "array",
        items: {
          type: "object",
          properties: {
            eventId: { type: "string" },
            eventName: { type: "string" },
            eventDate: { type: "string" }
          }
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
  
  export const getUserSchema = {
    description: "Obter informações do usuário",
    tags: ["Users"],
    response: {
      200: {
        type: "object",
        properties: {
          id: { type: "string" },
          email: { type: "string" }
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
          message: { type: "string" }
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
  