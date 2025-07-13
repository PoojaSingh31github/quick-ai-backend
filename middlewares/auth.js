//middle ware to check premium paln and check userid

import { clerkClient, getAuth } from '@clerk/express';

export const checkPremiumUser = async (req, res, next) => {
  try {
    const { userId , has } =await req.auth();
    const hasPremium =await has({plan:'premium'});

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized ❌' });
    }

    const user = await clerkClient.users.getUser(userId);
    const plan = user?.publicMetadata?.plan;

    if (!hasPremium && user?.privateMetadata?.free_usage) {
        req.free_usage = user.privateMetadata.free_usage;
      
    }else{
        await clerkClient.users.updateUserMetadata(userId, {
          privateMetadata: { free_usage: 0 }
        });
        req.free_usage = 0;
    }
    req.plan = hasPremium ? 'premium' : 'free';
    next();
  } catch (err) {
    console.error('Middleware error:', err);
    res.status(500).json({ message: 'Internal server error 🚨' });
  }
};
