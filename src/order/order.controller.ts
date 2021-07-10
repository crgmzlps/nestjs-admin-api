import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CreateOrderDto } from './models/dto/create-order.dto';
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

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return await this.orderService.create(createOrderDto);
  }

  @Get(':id')
  async get(@Param('id') id: number): Promise<Order> {
    return await this.orderService.findOne(id, ['order_items']);
  }
}
