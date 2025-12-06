<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\VerifyEmail as VerifyEmailBase;
use Illuminate\Notifications\Messages\MailMessage;

class CustomVerifyEmail extends VerifyEmailBase
{
    /**
     * Get the mail representation of the notification.
     */
    public function toMail($notifiable)
    {
        $verificationUrl = $this->verificationUrl($notifiable);

        return (new MailMessage)
            ->subject('🎉 Join PetMatch Today!')
            ->greeting('Hey there, ' . $notifiable->name . '!')
            ->line('Your adventure with PetMatch starts here!')
            ->action('Activate Account', $verificationUrl)
            ->line('Can\'t wait to see you around! 🐶🐱')
            ->salutation('Woof woof, The PetMatch Team');
    }
}
