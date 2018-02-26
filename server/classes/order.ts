export class Order {

    public orderId: number;
    public userId: number;
    public tableId: number;
    public content: number[] = []; 
    public timeCreated: string;

    constructor(
        orderId?: number, 
        userId?: number, 
        tableId?: number, 
        content?: number[], 
        timeCreated?: string
    ) { 
        this.orderId = orderId;
        this.userId = userId;
        this.tableId = tableId;
        this.content = content;
        this.timeCreated = timeCreated;
    }
}

export default new Order();