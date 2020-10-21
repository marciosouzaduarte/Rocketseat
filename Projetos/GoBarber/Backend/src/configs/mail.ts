interface IMailConfig {
  driver: 'ethereal' | 'gmail';

  defaults: {
    from: {
      email: string;
      name: string;
    };
  };
}

export default {
  driver: process.env.MAIL_DRIVER || 'ethereal',

  defaults: {
    from: {
      email: process.env.EMAIL,
      name: process.env.NAME,
    },
  },
} as IMailConfig;
