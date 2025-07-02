import React, { useState, useRef, useEffect } from 'react';

const PBCTF_RULES_CONTENT = `PBCTF 4.0 – Official Rule Book
Organized by Point Blank
Dayananda Sagar College of Engineering

📅 Event Details
• Date: August 2nd, 2025
• Time: 9:00 AM – 5:00 PM (8 hours)
• Venue: Computer Science & Engineering Block, Dayananda Sagar College of Engineering
• Address: Shavige Malleshwara Hills, Kumaraswamy Layout, Bengaluru – 560078
• Format: Jeopardy-style Capture The Flag (CTF)
• Team Size: Solo or Duo (maximum 2 participants per team)
• Eligibility: Open to all participants
• Platform: Official PBCTF CTFd platform
• Prizes: Cash prizes for top 3 teams/individuals (details to be announced)

🏆 Competition Format
PBCTF 4.0 is a Jeopardy-style Capture The Flag competition where participants solve cybersecurity challenges across various categories to earn points. Challenges increase in difficulty and point value, with flags being validated automatically upon submission.

👥 Registration & Eligibility
• Open to all participants regardless of experience level
• Participants can compete individually or form teams of up to 2 members
• All participants must carry valid college ID cards for verification

💻 Technical Requirements
What You Need to Bring:
• Laptop: Participants must bring their own laptops with necessary tools installed
• College ID: Mandatory for verification and entry
• Power Adapters: Ensure your devices stay charged throughout the event

Venue Provisions:
• Ethernet connections available (WiFi stability not guaranteed)
• Lab systems are available only upon prior request
• Power outlets are accessible at workstations

📋 Competition Rules
Team Formation & Participation
1. The maximum team size is 2 participants
2. Solo participation is encouraged and allowed
3. Team members must register together and compete under one team name

Challenge Guidelines
4. All challenges hosted on the official PBCTF CTFd platform
5. Flags are auto-validated upon submission
6. Points are awarded instantly for correct submissions
7. Final scores calculated as cumulative points from all solved challenges

Permitted Tools & Resources
8. Use of automated tools, scripts, and bots is allowed
9. AI assistants and online resources may be used
10. Standard cybersecurity tools and frameworks are permitted

Prohibited Activities
11. Sharing flags, hints, or solutions between teams is strictly prohibited
12. Posting challenge content, flags, or solutions on social media during the event
13. Any form of collaboration between different teams
14. Disrupting or attempting to break the challenge infrastructure
15. Attacking other participants' systems or the competition platform

🤝 Code of Conduct
Respect & Professionalism
• Treat all participants, organizers, and volunteers with respect
• Maintain a friendly and inclusive environment
• Professional behavior is expected at all times

Communication Guidelines
• Use designated communication channels (general chat/WhatsApp group)
• Keep discussions relevant to the competition
• No spam, repetitive messages, or off-topic content
• Avoid promotional content or unrelated links

Content Standards
• No racist, sexist, or discriminatory language
• Keep all content appropriate and professional
• No sexually explicit or inappropriate material
• Maintain a safe environment for all participants

Venue Etiquette
• Keep your workspace clean and organized
• Personal snacks allowed (clean up after yourself)
• Respect venue property and equipment
• Follow all college guidelines and regulations

🏅 Prizes & Recognition
Awards
• Top 3 Teams/Individuals: Cash prizes (amounts to be announced)
• All Participants: Certificate of participation
• Special Recognition: Additional prizes for unique solutions or exceptional performance

Criteria
• Rankings based on total points earned
• Tiebreakers are determined by submission time
• Special mentions for creative problem-solving approaches

⚖️ Dispute Resolution & Penalties
Violations & Consequences
• Flag/Solution Sharing: Point deduction or disqualification
• Inappropriate Behavior: Warning, point penalty, or removal
• Infrastructure Attacks: Immediate disqualification
• Repeated Violations: Permanent ban from future events

Dispute Process
• All disputes must be raised with the organizers immediately
• Organizers' decisions are final and binding
• Appeal process available for major disputes

📞 Support & Contact Information
Official Support Channels
• WhatsApp Group: Join PBCTF Support Group
• Use this channel for technical issues, clarifications, and updates

Event Coordinators
• Shreyas Reddy B: +91 7019151968
• R Ashwin: +91 8217016456
• Akash Singh: +91 9382598086

When to Contact Support
• Technical difficulties with the platform
• Rule clarifications or disputes
• Emergencies or concerns
• General event inquiries

📚 Learning & Development
PBCTF 4.0 is designed to be both competitive and educational. Whether you're a beginner or experienced practitioner, this event offers:
• Hands-on cybersecurity experience
• Exposure to real-world security challenges
• Networking opportunities with peers
• Skill development in various security domains

Tips for Success
• Come prepared with your favorite tools and resources
• Don't hesitate to ask questions in the support group
• Learn from each challenge, regardless of whether you solve it
• Enjoy the process and make connections with fellow participants

📝 Final Notes
• Event schedule and rules are subject to change at the organizers' discretion
• All participants are deemed to have agreed to these rules upon registration
• Updates and announcements will be shared via official communication channels
• Make the most of this learning opportunity and have fun!

Good luck to all participants! May the best team win!

Organized by Point Blank, Dayananda Sagar College of Engineering
For the latest updates, join our WhatsApp support group`;

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFullyRead: () => void;
  hasBeenFullyRead: boolean;
}

const RulesModal: React.FC<RulesModalProps> = ({ 
  isOpen, 
  onClose, 
  onFullyRead, 
  hasBeenFullyRead 
}) => {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (hasBeenFullyRead) {
      setHasScrolledToBottom(true);
      setScrollProgress(100);
    }
  }, [hasBeenFullyRead]);

  useEffect(() => {
    if (isOpen && !hasBeenFullyRead) {
      setScrollProgress(0);
      setHasScrolledToBottom(false);
    }
  }, [isOpen, hasBeenFullyRead]);

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      const { scrollTop, scrollHeight, clientHeight } = container;
      
      // Calculate scroll percentage
      const scrollableHeight = scrollHeight - clientHeight;
      const currentProgress = scrollableHeight > 0 ? (scrollTop / scrollableHeight) * 100 : 100;
      setScrollProgress(Math.min(currentProgress, 100));
      
      // Check if at bottom
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10; // 10px threshold
      
      if (isAtBottom && !hasScrolledToBottom) {
        setHasScrolledToBottom(true);
        onFullyRead();
      }
    }
  };

  const handleClose = () => {
    if (hasScrolledToBottom) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      
      {/* Modal */}
      <div className="relative bg-gray-900 border border-green-400/30 rounded-lg w-full max-w-4xl h-[80vh] mx-4 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-green-400/20">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-mono text-green-300">PBCTF 4.0 - Rules & Code of Conduct</h2>
            <button
              onClick={handleClose}
              disabled={!hasScrolledToBottom}
              className={`
                px-4 py-2 rounded font-mono text-sm transition-all duration-300
                ${hasScrolledToBottom 
                  ? 'bg-green-400/20 text-green-300 border border-green-400 hover:bg-green-400/30 cursor-pointer' 
                  : 'bg-gray-700/50 text-gray-500 border border-gray-700 cursor-not-allowed'
                }
              `}
            >
              {hasScrolledToBottom ? 'Close' : 'Scroll to Continue'}
            </button>
          </div>
          {!hasScrolledToBottom && (
            <p className="text-sm text-gray-400 font-mono mt-2">
              Please scroll through the entire document to continue ({Math.round(scrollProgress)}% complete)
            </p>
          )}
        </div>

        {/* Content */}
        <div 
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 p-6 overflow-y-auto custom-scrollbar"
        >
          <div className="text-gray-300 font-mono text-sm leading-relaxed whitespace-pre-wrap">
            {PBCTF_RULES_CONTENT}
          </div>
          
          {/* Bottom indicator */}
          {!hasScrolledToBottom && (
            <div className="mt-8 p-4 bg-green-400/10 border border-green-400/30 rounded text-center">
              <p className="text-green-300 font-mono text-sm">
                ⬇️ Continue scrolling to reach the end
              </p>
            </div>
          )}
          
          {hasScrolledToBottom && (
            <div className="mt-8 p-4 bg-green-400/20 border border-green-400 rounded text-center">
              <p className="text-green-300 font-mono text-sm">
                ✅ You have read the complete rules and code of conduct
              </p>
            </div>
          )}
        </div>

        {/* Footer with scroll progress */}
        <div className="p-4 border-t border-green-400/20">
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div 
              className="bg-green-400 h-2 rounded-full transition-all duration-150 ease-out"
              style={{ 
                width: `${scrollProgress}%`
              }}
            />
          </div>
          <p className="text-xs text-gray-400 font-mono mt-2 text-center">
            {hasScrolledToBottom ? 'Reading Complete' : `Scroll Progress: ${Math.round(scrollProgress)}%`}
          </p>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(75, 85, 99, 0.3);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(34, 197, 94, 0.5);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(34, 197, 94, 0.7);
        }
      `}</style>
    </div>
  );
};

export default RulesModal; 