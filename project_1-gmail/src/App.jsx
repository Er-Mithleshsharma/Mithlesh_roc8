import React, { useState, useEffect, useMemo } from "react";
import EmailCard from "./components/EmailCard";
import Avatar from "./components/Avatar";


// Main App Component
const App = () => {
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [emailBody, setEmailBody] = useState("");
  const [isSplitView, setIsSplitView] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [filter, setFilter] = useState("all");

  const fetchEmails = async (page) => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const response = await fetch(`https://flipkart-email-mock.now.sh/?page=${page}`);
      if (!response.ok) {
    
        setErrorMessage("No more emails to load.");  
          throw new Error("No more emails to load.");
      }
      const data = await response.json();
      if (data.list.length === 0) {
        setErrorMessage("No more emails to load.");
        setEmails([]);
      } else {
        const persistedEmails = localStorage.getItem("emails");
        const persistedEmailList = persistedEmails ? JSON.parse(persistedEmails) : [];
        const updatedEmails = data.list.map((email) => {
          const persistedEmail = persistedEmailList.find((e) => e.id === email.id);
          return persistedEmail ? { ...email, ...persistedEmail } : email;
        });
        setEmails(updatedEmails);
      }
    } catch (error) {
      setErrorMessage(error.message || "Failed to fetch emails.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmails(currentPage);
  }, [currentPage]);

  const fetchEmailBody = async (id) => {
    try {
      const response = await fetch(`https://flipkart-email-mock.now.sh/?id=${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch email body.");
      }
      const data = await response.json();
      setEmailBody(data.body);
    } catch (error) {
      setEmailBody("Error loading email content.");
    }
  };

  const handleEmailClick = (email) => {
    setSelectedEmail(email);
    fetchEmailBody(email.id);
    setIsSplitView(true);
    if (!email.read) {
      markAsRead(email);
    }
  };

  const handleBack = () => {
    setIsSplitView(false);
    setSelectedEmail(null);
    setEmailBody("");
  };

  const markAsFavorite = (emailId) => {
    const updatedEmails = emails.map((email) => {
      if (email.id === emailId) {
        email.favorite = !email.favorite;
      }
      return email;
    });
    setEmails(updatedEmails);
    localStorage.setItem("emails", JSON.stringify(updatedEmails));
  };

  const markAsRead = (email) => {
    email.read = true;
    const updatedEmails = emails.map((e) => (e.id === email.id ? email : e));
    setEmails(updatedEmails);
    localStorage.setItem("emails", JSON.stringify(updatedEmails));
  };

  const filterEmails = (filterType) => {
    setFilter(filterType);
  };

  const filteredEmails = useMemo(
    () => emails.filter((email) => {
      if (filter === "favorites") return email.favorite;
      if (filter === "read") return email.read;
      if (filter === "unread") return !email.read;
      return true; // all emails
    }),
    [emails, filter]
  );
  const handleNextPage = () => {
    if(errorMessage === "No more emails to load.") return;
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };
  return (
    <main className="min-h-screen bg-[#F4F5F9] p-6">
      <section className="mb-4 flex gap-4">
        <button onClick={() => filterEmails("all")} className="px-4 py-2 rounded-full bg-[#E1E4EA] text-[#636363] font-medium hover:bg-[#E54065] hover:text-white shadow-sm transition">
          All
        </button>
        <button onClick={() => filterEmails("favorites")} className="px-4 py-2 rounded-full bg-[#E1E4EA] text-[#636363] font-medium hover:bg-[#E54065] hover:text-white shadow-sm transition">
          Favorites
        </button>
        <button onClick={() => filterEmails("read")} className="px-4 py-2 rounded-full bg-[#E1E4EA] text-[#636363] font-medium hover:bg-[#E54065] hover:text-white shadow-sm transition">
          Read
        </button>
        <button onClick={() => filterEmails("unread")} className="px-4 py-2 rounded-full bg-[#E1E4EA] text-[#636363] font-medium hover:bg-[#E54065] hover:text-white shadow-sm transition">
          Unread
        </button>
      </section>

      {isSplitView ? (
        <section className="flex flex-col md:flex-row gap-4">
          <div className="bg-white rounded shadow w-[40%]">
            {filteredEmails.map((email) => (
              <EmailCard
                key={email.id}
                email={email}
                onClick={() => handleEmailClick(email)}
                isSelected={selectedEmail?.id === email.id}
                isRead={email.read}
              />
            ))}
          </div>

          <div className="bg-white rounded shadow p-6 w-[60%]">
            <div className="flex justify-between">
              <button onClick={handleBack} className="mb-4 text-[#E54065] hover:underline">
                Back to Email List
              </button>
              <button onClick={() => markAsFavorite(selectedEmail.id)} className="mt-4 px-4 py-2 rounded-full bg-[#E54065] text-white shadow hover:bg-[#D63354] transition font-normal">
                {selectedEmail.favorite ? "Unmark as Favorite" : "Mark as Favorite"}
              </button>
            </div>
            {selectedEmail && (
              <div className="flex gap-4">
                <Avatar name={selectedEmail.from.name} />
                <div>
                  <h2 className="text-xl font-bold">{selectedEmail.subject}</h2>
                  <p className="text-gray-500 mb-4">{new Date(selectedEmail.date).toLocaleString()}</p>
                  <div className="text-gray-700" dangerouslySetInnerHTML={{ __html: emailBody }} />
                </div>
              </div>
            )}
          </div>
        </section>
      ) : (
        <section>
          
          {isLoading ? (
            <div className="flex flex-col gap-2">
            <div className="h-32 bg-gray-200 shimmer rounded w-full mb-2"></div>
            <div className="h-32 bg-gray-200 shimmer rounded w-full mb-2"></div>
            <div className="h-32 bg-gray-200 shimmer rounded w-full mb-2"></div>
            <div className="h-32 bg-gray-200 shimmer rounded w-full"></div>
            <div className="h-32 bg-gray-200 shimmer rounded w-full mb-2"></div>
            <div className="h-32 bg-gray-200 shimmer rounded w-full"></div>
          </div>
          ) : (
            filteredEmails.map((email) => (
              <EmailCard
                key={email.id}
                email={email}
                onClick={() => handleEmailClick(email)}
                isSelected={selectedEmail?.id === email.id}
                isRead={email.read}
              />
            ))
          )}
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        </section>
      )}
       <div className="mb-4 flex justify-center mt-4">
        <button
          disabled={currentPage === 1}
          onClick={handlePreviousPage}
          className="px-4 py-2 mr-2 rounded bg-[#E1E4EA] hover:bg-[#E54065] hover:text-white transition"
        >
          Previous
        </button>
        <button
          disabled={errorMessage === "No more emails to load."}
          onClick={handleNextPage}
          className="px-4 py-2 rounded bg-[#E1E4EA] hover:bg-[#E54065] hover:text-white transition"
        >
          Next
        </button>
      </div>
    </main>
  );
};

export default App;
