import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { Parser } from 'json2csv';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CreateOrderDto } from './models/dto/create-order.dto';
import { OrderItem } from './models/order-item.entity';
import { Order } from './models/order.entity';
import { OrderService } from './order.service';

@UseGuards(AuthGuard)
@UseInterceptors(ClassSerializerInterceptor) //only works when return entities and not plain js objects
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  async all(@Query('page') page: number) {
    return await this.orderService.paginate(page, ['order_items']);
  }

  @Get('csv')
  async export(@Res() response: Response): Promise<any> {
    const parser = new Parser({
      fields: ['ID', 'Name', 'Email', 'Product Title', 'Price', 'Quantity'],
    });
    const orders = await this.orderService.all(['order_items']);
    const json = [];
    orders.forEach((o: Order) => {
      json.push({
        ID: o.id,
        Name: o.name,
        Email: o.email,
        'Product Title': '',
        Price: '',
        Quantity: '',
      });
      o.order_items.forEach((i: OrderItem) => {
        json.push({
          ID: '',
          Name: '',
          Email: '',
          'Product Title': i.product_title,
          Price: i.price,
          Quantity: i.quantity,
        });
      });
    });
    const csv = parser.parse(json);
    response.header('Content-Type', 'text/csv');
    response.attachment('orders.csv');
    response.send(csv);
  }

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return await this.orderService.create(createOrderDto);
  }

  @Get(':id')
  async get(@Param('id') id: number): Promise<Order> {
    return await this.orderService.findOne(id, ['order_items']);
  }
}
