import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: 'MySecret',
      signOptions: {
        expiresIn: '1d',
      },
    }),
  ],
  exports: [JwtModule],
  providers: [],
})
export class CommonModule {}
