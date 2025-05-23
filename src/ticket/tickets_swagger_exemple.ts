export const BuyTicketSE = {
    message: 'Ticket bought successfully!',
    data: {
        id: 1,
        ticketName: "Ingresso Tomorrowland",
        user: {
            name: "Thales",
        }
    }
}

export const CreateTicketSE = {
    message: 'Ticket type created successfully!',
    data: {
        id: 1,
        ticketName: "VIP - Ingresso Tomorrowland",
        user: {
            name: "Thales",
        }
    }
}

export const FindUserTicketsSE = [{
    id: 6,
    ticket_type_id: 5,
    user_id: 2,
    event_id: 3,
    event_name: 'Tomorrowland',
    ticket_type_name: 'VIP',
    user_name: 'João Paulo'
},
{
    id: 7,
    ticket_type_id: 5,
    user_id: 2,
    event_id: 3,
    event_name: 'Sarara',
    ticket_type_name: 'PISTA',
    user_name: 'João Paulo'
}]

export const FindAllTicketsSE = [{
    id: 60,
    ticket_type_id: 8,
    user_id: 595,
    event_id: 5,
    event_name: 'Planeta Brasil',
    ticket_name: 'OPEN BAR - PLANETA BRASIL',
    ticket_type_name: 'OPEN BAR',
    user_name: 'Cláudia Leite',
    user_email: "claudialeite@gmail.com",
},
{
    id: 68,
    ticket_type_id: 12,
    user_id: 420,
    event_id: 90,
    event_name: 'After Life',
    ticket_name: 'CAMAROTA - AFTERLIFE',
    ticket_type_name: 'CAMAROTE',
    user_name: 'Bianca Ribeiro',
    user_email: "biancaribeiro@gmail.com",
}]

export const FindAllTypesSE = [{
    id: 78,
    name: 'VIP',
    event_id: 5,
    event_name: 'Só Track Boa',
    price: 50.90,
    quantity: 500,
},
{
    id: 45,
    name: 'PISTA',
    event_id: 5,
    event_name: 'Só Track Boa',
    price: 50.90,
    quantity: 500,
}]

export const FindOneTicketSE = {
    id: 37,
    ticket_name: 'OPEN BAR - THE CHOIC',
    created_at: Date.now(),
    ticket_type_id: 6,
    user_id: 560,
    event_id: 777,
    event_name: 'THE CHOIC',
    ticket_type_name: 'OPEN BAR',
    user_name: 'Kaue Magalhães',
    user_email: 'kauemaga@gmail.com'
}

export const UpdateTicketSE = {
    message: 'Ticket updated successfully!',
    data: {
        id: 33,
        createdAt: Date.now(),
        ticketName: 'PISTA - Happy Holly',
        ticketTypeId: 6,
        userId: 7,
    }
}

export const UpdateTypeSE = {
    id: 60,
    name: 'UPDATED TYPE',
    price: 190.90,
    quantity: 90,
    eventId: 50,
}