import { prisma } from "@/prisma/client"


// function to create user's order in database 
export const createUserOrder = createFunction(
    {
        Id:'create-user-order',
        batchEvents:{
            maxSize: 25,
            timeout:'5s'
        }
    },
    {event: 'order/create'},
    async ({events})=>{
        const orders = events.map((event)=>{
            return {
                userId:event.data.userId,
                items:event.data.items,
                amount:event.data.amount,
                address:event.data.address,
                date:event.data.date
            }
        })
        await prisma.order.createMany({
            data:orders
        })
        return {success:true, processed:orders.length};
    }
)