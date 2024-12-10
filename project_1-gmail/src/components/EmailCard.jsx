import React from "react";
import Avatar from "./Avatar";
const EmailCard = ({ email, onClick, isSelected, isRead }) => (
    <article
      className={`flex items-center gap-4 p-4 border-b ${
        isSelected ? "bg-[#f5b7c5] text-white" : isRead ? "bg-[#F2F2F2]" : "hover:bg-gray-100"
      } cursor-pointer`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-4">
          <Avatar name={email.from.name} />
          <div>
            <p className="font-bold text-[#636363]">
              From: {email.from.name} &lt;{email.from.email}&gt;
            </p>
            <p className="text-gray-600">Subject: {email.subject}</p>
            <p className="text-gray-500 mb-4">{new Date(email.date).toLocaleString()}</p>
            <p className="text-sm text-gray-600">
              {email.short_description.length > 50
                ? `${email.short_description.substring(0, 50)}...`
                : email.short_description}
            </p>
          </div>
        </div>
        <div>
          {email.favorite && (
            <span className="inline-block text-xs px-2 py-1 bg-[#E54065] text-white rounded-full">
              Favorite
            </span>
          )}
        </div>
      </div>
    </article>
  );
  export default EmailCard;