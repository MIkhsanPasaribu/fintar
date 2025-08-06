import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

export interface EmailOptions {
  to: string;
  subject: string;
  html?: string;
  text?: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: Transporter;

  constructor(private configService: ConfigService) {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    const smtpHost = this.configService.get<string>('SMTP_HOST', 'smtp.gmail.com');
    const smtpPort = this.configService.get<number>('SMTP_PORT', 587);
    const smtpUser = this.configService.get<string>('SMTP_USER');
    const smtpPass = this.configService.get<string>('SMTP_PASS');

    if (!smtpUser || !smtpPass) {
      this.logger.warn('⚠️ SMTP credentials not configured. Email service will not work.');
      return;
    }

    const emailConfig: any = {
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465, // true for 465, false for other ports like 587
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    };

    // Add TLS configuration for Gmail and other providers
    if (smtpPort === 587) {
      emailConfig.tls = {
        ciphers: 'SSLv3',
        rejectUnauthorized: false,
        secureProtocol: 'TLSv1_2_method',
      };
    }

    // Additional configuration for Gmail specifically
    if (smtpHost.includes('gmail.com')) {
      emailConfig.service = 'gmail';
      emailConfig.tls = {
        rejectUnauthorized: false,
      };
    }

    try {
      this.transporter = nodemailer.createTransport(emailConfig);
      this.logger.log('✅ Email service initialized successfully');
      
      // Verify the connection configuration
      this.verifyConnection();
    } catch (error) {
      this.logger.error('❌ Failed to initialize email service:', error);
    }
  }

  private async verifyConnection() {
    if (!this.transporter) return;

    try {
      await this.transporter.verify();
      this.logger.log('✅ SMTP connection verified successfully');
    } catch (error) {
      this.logger.error('❌ SMTP connection verification failed:', error);
    }
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    if (!this.transporter) {
      this.logger.error('❌ Email transporter not initialized - SMTP credentials missing');
      return false;
    }

    try {
      const mailOptions = {
        from: `"Fintar" <${this.configService.get<string>('SMTP_FROM', this.configService.get<string>('SMTP_USER'))}>`,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      };

      this.logger.log(`📧 Attempting to send email to ${options.to}`);
      const result = await this.transporter.sendMail(mailOptions);
      this.logger.log(`✅ Email sent successfully to ${options.to} (Message ID: ${result.messageId})`);
      return true;
    } catch (error) {
      this.logger.error(`❌ Failed to send email to ${options.to}:`, error);
      
      // Provide more specific error messages
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('wrong version number')) {
        this.logger.error('💡 SSL/TLS Configuration Error: Try updating SMTP settings or checking Gmail App Password');
      } else if (errorMessage.includes('Authentication failed')) {
        this.logger.error('💡 Authentication Error: Check SMTP_USER and SMTP_PASS credentials');
      } else if (errorMessage.includes('ECONNREFUSED')) {
        this.logger.error('💡 Connection Error: Check SMTP_HOST and SMTP_PORT settings');
      }
      
      return false;
    }
  }

  async sendVerificationEmail(email: string, firstName: string, verificationToken: string): Promise<boolean> {
    const verificationUrl = `${this.configService.get<string>('FRONTEND_URL', 'http://localhost:3000')}/verify-email?token=${verificationToken}`;

    const htmlContent = this.getVerificationEmailTemplate(firstName, verificationUrl);
    const textContent = this.getVerificationEmailText(firstName, verificationUrl);

    return this.sendEmail({
      to: email,
      subject: 'Verifikasi Email Anda - Fintar',
      html: htmlContent,
      text: textContent,
    });
  }

  private getVerificationEmailTemplate(firstName: string, verificationUrl: string): string {
    return `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verifikasi Email - Fintar</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 10px; margin-top: 20px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
        .header { text-align: center; padding: 20px 0; border-bottom: 3px solid #0052CC; }
        .logo { font-size: 28px; font-weight: bold; color: #003D82; margin-bottom: 10px; }
        .tagline { color: #546E7A; font-size: 14px; }
        .content { padding: 30px 0; }
        .greeting { font-size: 18px; color: #0A1628; margin-bottom: 20px; }
        .message { color: #37474F; margin-bottom: 30px; line-height: 1.8; }
        .cta-button { display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #0052CC, #0066FF); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold; text-align: center; margin: 20px 0; transition: transform 0.2s; }
        .cta-button:hover { transform: translateY(-2px); }
        .alternative-link { background-color: #F5F7FA; padding: 15px; border-radius: 5px; margin: 20px 0; word-break: break-all; }
        .footer { text-align: center; padding: 20px 0; border-top: 1px solid #E9ECEF; color: #78909C; font-size: 12px; }
        .security-notice { background-color: #E3F2FD; padding: 12px; border-radius: 5px; margin: 20px 0; color: #1976D2; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">FINTAR</div>
          <div class="tagline">Solusi Finansial Pintar</div>
        </div>
        
        <div class="content">
          <div class="greeting">Halo ${firstName}! 👋</div>
          
          <div class="message">
            Selamat datang di <strong>Fintar</strong>! Kami senang Anda bergabung dengan platform finansial pintar kami.
            <br><br>
            Untuk mengaktifkan akun Anda dan mulai menggunakan layanan AI Financial Co-Pilot kami, silakan klik tombol verifikasi di bawah ini:
          </div>
          
          <div style="text-align: center;">
            <a href="${verificationUrl}" class="cta-button">
              ✅ Verifikasi Email Saya
            </a>
          </div>
          
          <div class="alternative-link">
            <strong>Atau salin dan tempel link berikut di browser Anda:</strong><br>
            <a href="${verificationUrl}" style="color: #0052CC;">${verificationUrl}</a>
          </div>
          
          <div class="security-notice">
            🔒 <strong>Keamanan:</strong> Link verifikasi ini akan kedaluwarsa dalam 24 jam. Jika Anda tidak membuat akun di Fintar, abaikan email ini.
          </div>
        </div>
        
        <div class="footer">
          <p>© 2025 Fintar - Solusi Finansial Pintar untuk Keluarga dan UMKM</p>
          <p>Email ini dikirim secara otomatis, mohon jangan membalas.</p>
        </div>
      </div>
    </body>
    </html>
    `;
  }

  private getVerificationEmailText(firstName: string, verificationUrl: string): string {
    return `
Halo ${firstName}!

Selamat datang di Fintar - Solusi Finansial Pintar!

Untuk mengaktifkan akun Anda, silakan klik link verifikasi berikut:
${verificationUrl}

Link ini akan kedaluwarsa dalam 24 jam.

Jika Anda tidak membuat akun di Fintar, abaikan email ini.

Terima kasih,
Tim Fintar

© 2025 Fintar - Solusi Finansial Pintar untuk Keluarga dan UMKM
    `;
  }

  async sendPasswordResetEmail(email: string, firstName: string, resetToken: string): Promise<boolean> {
    const resetUrl = `${this.configService.get<string>('FRONTEND_URL', 'http://localhost:3000')}/reset-password?token=${resetToken}`;

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Password - Fintar</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 10px; margin-top: 20px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
        .header { text-align: center; padding: 20px 0; border-bottom: 3px solid #FF9800; }
        .logo { font-size: 28px; font-weight: bold; color: #003D82; margin-bottom: 10px; }
        .tagline { color: #546E7A; font-size: 14px; }
        .content { padding: 30px 0; }
        .greeting { font-size: 18px; color: #0A1628; margin-bottom: 20px; }
        .message { color: #37474F; margin-bottom: 30px; line-height: 1.8; }
        .cta-button { display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #FF9800, #F57C00); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold; text-align: center; margin: 20px 0; }
        .security-notice { background-color: #FFF3E0; padding: 12px; border-radius: 5px; margin: 20px 0; color: #E65100; font-size: 14px; }
        .footer { text-align: center; padding: 20px 0; border-top: 1px solid #E9ECEF; color: #78909C; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">FINTAR</div>
          <div class="tagline">Reset Password Anda</div>
        </div>
        
        <div class="content">
          <div class="greeting">Halo ${firstName}!</div>
          
          <div class="message">
            Kami menerima permintaan untuk reset password akun Fintar Anda.
            <br><br>
            Klik tombol di bawah ini untuk membuat password baru:
          </div>
          
          <div style="text-align: center;">
            <a href="${resetUrl}" class="cta-button">
              🔐 Reset Password
            </a>
          </div>
          
          <div class="security-notice">
            ⚠️ <strong>Penting:</strong> Link ini akan kedaluwarsa dalam 1 jam. Jika Anda tidak meminta reset password, abaikan email ini.
          </div>
        </div>
        
        <div class="footer">
          <p>© 2025 Fintar - Solusi Finansial Pintar</p>
        </div>
      </div>
    </body>
    </html>
    `;

    const textContent = `
Halo ${firstName}!

Kami menerima permintaan untuk reset password akun Fintar Anda.

Klik link berikut untuk reset password:
${resetUrl}

Link ini akan kedaluwarsa dalam 1 jam.

Jika Anda tidak meminta reset password, abaikan email ini.

Tim Fintar
    `;

    return this.sendEmail({
      to: email,
      subject: 'Reset Password - Fintar',
      html: htmlContent,
      text: textContent,
    });
  }
}
