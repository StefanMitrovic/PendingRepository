import React from 'react';
import { format } from 'timeago.js';

export default  function Message({ message, own }) {
  return (
    <div className={ own ? 'message own' : 'message'}>
      <div className='messageTop'>
        <img 
          className='messageImg'
          src='https://www.w3schools.com/howto/img_avatar2.png' 
          alt=''
        />
        <p className='messageText'> { message.text } </p>
      </div>
      <div className='messageBottom'>
        { format(message.createdAt) }
      </div>
    </div>
  )
}