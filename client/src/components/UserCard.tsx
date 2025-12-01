import React, { useState } from "react";
import { MessageCircle } from "lucide-react";

export interface User {
  id: number;
  fullName: string;
  username: string;
  role: "Student" | "Counsellor";
  bio: string;
  location: string;
  followers: number;
  following: number;
  posts: number;
  joinDate: string;
  avatarUrl: string;
}

interface UserCardProps {
  user: User;
  onMessage?: () => void;
  mutualConnections?: number;
  isPrivate?: boolean;
}

const UserCard: React.FC<UserCardProps> = ({
  user,
  onMessage,
  mutualConnections,
  isPrivate,
}) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);

  const handleFollowClick = () => {
    setIsFollowing(!isFollowing);
  };

  const handleMessageClick = () => {
    setShowMessageModal(true);
    if (onMessage) onMessage();
  };

  const closeMessageModal = () => {
    setShowMessageModal(false);
  };

  const roleBadgeColor =
    user.role === "Student" ? "bg-[#3e5d32]" : "bg-[#256d63]";

  return (
    <>
      <div className="rounded-2xl shadow-lg bg-white/95 backdrop-blur-sm p-6 flex flex-col items-center border border-[#D2E4D3] hover:shadow-xl transition-all duration-300 hover:scale-105">
        <img
          src={user.avatarUrl}
          alt={user.fullName}
          className="w-20 h-20 rounded-full border-3 border-[#D2E4D3] mb-4 shadow-md"
          loading="lazy"
        />
        <div className="font-bold text-lg text-[#345E2C] mb-1">{user.fullName}</div>
        <div className="text-sm text-[#3e5d32] mb-2">{user.username}</div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${roleBadgeColor} shadow-sm`}
        >
          {user.role}
        </span>
        {isPrivate && (
          <span className="mt-1 text-xs text-[#A996E6] font-semibold">
            Private
          </span>
        )}
        <div className="text-sm text-[#345E2C] mt-3 text-center leading-relaxed px-2">{user.bio}</div>
        <div className="text-xs text-[#256d63] mt-2 font-medium">{user.location}</div>
        <div className="flex justify-center gap-4 text-xs text-[#345E2C] mt-3 bg-[#F8FAF8] rounded-lg py-2 px-4">
          <div className="text-center">
            <div className="font-bold">{user.followers}</div>
            <div className="text-[#256d63]">Followers</div>
          </div>
          <div className="text-center">
            <div className="font-bold">{user.following}</div>
            <div className="text-[#256d63]">Following</div>
          </div>
          <div className="text-center">
            <div className="font-bold">{user.posts}</div>
            <div className="text-[#256d63]">Posts</div>
          </div>
        </div>
        <div className="text-xs text-[#3e5d32] mt-2 font-medium">
          Joined {user.joinDate}
        </div>
        {typeof mutualConnections === "number" && (
          <div className="text-xs text-[#A996E6] mt-1">
            {mutualConnections} mutual connections
          </div>
        )}
        <div className="flex gap-3 mt-4 w-full">
          <button
            onClick={handleFollowClick}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 shadow-md ${
              isFollowing
                ? "bg-[#D2E4D3] text-[#345E2C] hover:bg-[#A996E6] hover:text-white"
                : "bg-gradient-to-r from-[#345E2C] to-[#256d63] text-white hover:shadow-lg transform hover:scale-105"
            }`}
          >
            {isFollowing ? "Following" : "Follow"}
          </button>
          <button
            onClick={handleMessageClick}
            className="bg-[#A996E6] text-white px-4 py-3 rounded-xl font-semibold hover:bg-[#345E2C] transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
            aria-label={`Message ${user.fullName}`}
          >
            <MessageCircle className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center space-x-3 mb-4">
              <img
                src={user.avatarUrl}
                alt={user.fullName}
                className="w-12 h-12 rounded-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user.fullName
                  )}&background=345E2C&color=fff`;
                }}
              />
              <div>
                <h3 className="font-semibold text-[#345E2C]">
                  {user.fullName}
                </h3>
                <p className="text-sm text-[#3e5d32]">{user.username}</p>
              </div>
            </div>
            <p className="text-gray-600 mb-6">
              Messaging feature coming soon! You'll be able to connect directly
              with community members.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={closeMessageModal}
                className="flex-1 py-2 px-4 bg-[#345E2C] text-white rounded-lg hover:bg-[#2a4a23] transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserCard;
