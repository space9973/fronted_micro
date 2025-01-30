import React, { useState } from 'react';
import { Mail, Trash, Edit3, Menu } from 'lucide-react';

interface Email {
  id: string;
  from: string;
  to: string;
  subject: string;
  content: string;
  date: string;
  read: boolean;
}

const mockEmails: Email[] = [
  {
    id: '1',
    from: 'john.doe@example.com',
    to: 'you@example.com',
    subject: 'Project Update',
    content: 'Here are the latest updates on the project...',
    date: '2024-03-15',
    read: false
  },
  {
    id: '2',
    from: 'jane.smith@example.com',
    to: 'you@example.com',
    subject: 'Meeting Tomorrow',
    content: 'Let\'s discuss the upcoming features...',
    date: '2024-03-14',
    read: true
  }
];

export const EmailApp = () => {
  const [emails, setEmails] = useState<Email[]>(mockEmails);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [isComposing, setIsComposing] = useState(false);
  const [trashEmails, setTrashEmails] = useState<Email[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const deleteEmail = (id: string) => {
    const emailToDelete = emails.find((email) => email.id === id);
    if (emailToDelete) {
      setTrashEmails([emailToDelete, ...trashEmails]);
      setEmails(emails.filter((email) => email.id !== id));
      setSelectedEmail(null);
    }
  };

  const restoreEmail = (id: string) => {
    const emailToRestore = trashEmails.find((email) => email.id === id);
    if (emailToRestore) {
      setEmails([emailToRestore, ...emails]);
      setTrashEmails(trashEmails.filter((email) => email.id !== id));
    }
  };

  const selectEmail = (email: Email) => {
    setSelectedEmail(email);
  };

  const handleCompose = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newEmail: Email = {
      id: String(emails.length + 1),
      from: 'you@example.com', // Simulating the sender
      to: formData.get('to') as string,
      subject: formData.get('subject') as string,
      content: formData.get('content') as string,
      date: new Date().toISOString().split('T')[0],
      read: false
    };
    setEmails([newEmail, ...emails]);
    setIsComposing(false);
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-100">
      {/* Navbar */}
      <div className={`lg:w-1/4 bg-white shadow-md p-4 ${isMenuOpen ? 'block' : 'hidden lg:block'} lg:relative absolute z-10 w-full`}>
        <button
          onClick={() => setIsComposing(true)}
          className="w-full mb-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center space-x-2"
        >
          <Edit3 size={16} />
          <span>Compose</span>
        </button>
        <nav>
          <button
            onClick={() => {
              setSelectedEmail(null);
              setIsComposing(false);
            }}
            className="block mb-2 text-gray-800 hover:text-blue-600 flex items-center w-full text-left"
          >
            <Mail size={16} className="mr-2" /> Inbox
          </button>
          <button
            onClick={() => {
              setSelectedEmail(null);
              setIsComposing(false);
              setEmails([]); // Filter to display trash emails if necessary.
            }}
            className="block mb-2 text-gray-800 hover:text-blue-600 flex items-center w-full text-left"
          >
            <Trash size={16} className="mr-2" /> Trash
          </button>
        </nav>
      </div>

      {/* Hamburger Menu for Mobile */}
      <div className="lg:hidden bg-white shadow-md p-4 flex items-center justify-between">
        <h1 className="text-lg font-bold">Email App</h1>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 text-gray-700 rounded-md hover:bg-gray-200"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {isComposing ? (
          <form onSubmit={handleCompose} className="bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-4">Compose Email</h1>
            <div className="mb-4">
              <label htmlFor="to" className="block text-sm font-medium text-gray-700 mb-1">To</label>
              <input
                id="to"
                name="to"
                type="email"
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <input
                id="subject"
                name="subject"
                type="text"
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">Content</label>
              <textarea
                id="content"
                name="content"
                className="w-full p-2 border rounded-md h-40"
                required
              ></textarea>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsComposing(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Send
              </button>
            </div>
          </form>
        ) : !selectedEmail ? (
          <div>
            <h1 className="text-2xl font-bold mb-4">Inbox</h1>
            {emails.map((email) => (
              <div
                key={email.id}
                className={`p-4 mb-2 border rounded-lg ${email.read ? 'bg-gray-200' : 'bg-white'} cursor-pointer`}
                onClick={() => selectEmail(email)}
              >
                <h2 className="font-bold text-lg">{email.subject}</h2>
                <p className="text-gray-600 truncate">{email.content}</p>
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>{email.from}</span>
                  <span>{email.date}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <button
              onClick={() => setSelectedEmail(null)}
              className="text-blue-600 hover:underline mb-4"
            >
              Back to Inbox
            </button>
            <h1 className="text-2xl font-bold mb-2">{selectedEmail.subject}</h1>
            <p className="text-gray-600 mb-4">From: {selectedEmail.from}</p>
            <p>{selectedEmail.content}</p>
            <button
              onClick={() => deleteEmail(selectedEmail.id)}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Delete Email
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailApp;
