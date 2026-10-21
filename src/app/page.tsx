
"use client";

import { useEffect, useMemo, useState } from "react";

type Service = {
  id: number;
  icon: string;
  title: string;
  category: string;
  description: string;
  details: string[];
  requirements: string[];
  office: string;
};

type Request = {
  id: string;
  name: string;
  contact: string;
  service: string;
  message: string;
  date: string;
};

const services: Service[] = [
  {
    id: 1,
    icon: "💰",
    title: "Social Pension",
    category: "Financial",
    description: "Explore information about social pension assistance.",
    details: [
      "Learn whether a social pension program may apply to your situation.",
      "Ask the appropriate local office about current application periods.",
      "Confirm eligibility and benefit details before applying.",
    ],
    requirements: [
      "Ask the local office for the current documentary checklist.",
      "Prepare valid identification if requested.",
      "Confirm eligibility with the responsible government office.",
    ],
    office: "Office for Senior Citizens Affairs (OSCA) or the relevant local social welfare office",
  },
  {
    id: 2,
    icon: "🏥",
    title: "Health Services",
    category: "Health",
    description: "Find information about healthcare and medical assistance.",
    details: [
      "Ask about available health programs and senior citizen services.",
      "Check schedules for local health center services.",
      "Confirm medical assistance coverage with the responsible provider.",
    ],
    requirements: [
      "Ask the healthcare provider what documents are needed.",
      "Bring relevant identification and medical records when requested.",
    ],
    office: "Local health center, hospital, or appropriate government health office",
  },
  {
    id: 3,
    icon: "🪪",
    title: "Senior Citizen ID",
    category: "Documents",
    description: "Learn how to ask about senior citizen ID applications.",
    details: [
      "Ask where applications are accepted in your locality.",
      "Request the current application form and documentary checklist.",
      "Confirm processing schedules directly with the issuing office.",
    ],
    requirements: [
      "Proof of age and identity, as required by the issuing office.",
      "Proof of residence, if required.",
      "Additional documents specified by your local OSCA.",
    ],
    office: "Local Office for Senior Citizens Affairs (OSCA)",
  },
  {
    id: 4,
    icon: "🤝",
    title: "Community Programs",
    category: "Community",
    description: "Explore community activities and local assistance.",
    details: [
      "Ask about senior citizen association activities.",
      "Find out about community gatherings and wellness programs.",
      "Confirm registration schedules and participation requirements.",
    ],
    requirements: [
      "Check whether advance registration is necessary.",
      "Ask the organizing office about any required identification.",
    ],
    office: "Local OSCA, barangay office, or senior citizen association",
  },
  {
    id: 5,
    icon: "💊",
    title: "Medicine Assistance",
    category: "Health",
    description: "Learn where to ask about medicine assistance programs.",
    details: [
      "Ask whether medicine assistance is available in your locality.",
      "Confirm coverage, eligibility, and application procedures.",
      "Consult a qualified healthcare professional about medicines.",
    ],
    requirements: [
      "Ask the responsible office for its current requirements.",
      "Medical prescription or other supporting documents may be required.",
    ],
    office: "Appropriate local social welfare office or healthcare provider",
  },
  {
    id: 6,
    icon: "📋",
    title: "Requirements Guide",
    category: "Documents",
    description: "Get started with common questions about documents.",
    details: [
      "Identify the office responsible for your concern.",
      "Request its latest official checklist.",
      "Verify document formats and any fees before visiting.",
    ],
    requirements: [
      "Requirements depend on the service and responsible office.",
      "Do not submit original documents unless the office requires them.",
    ],
    office: "The government office responsible for your requested service",
  },
];

const initialAnnouncements = [
  {
    title: "Check local service schedules",
    text: "Contact your local office to verify current service hours and application schedules.",
    date: "General reminder",
  },
  {
    title: "Prepare before visiting",
    text: "Ask which documents are required for your specific concern before visiting an office.",
    date: "General reminder",
  },
];

const categories = ["All", "Financial", "Health", "Documents", "Community"];

const faqs = [
  {
    q: "How do I apply for a senior citizen ID?",
    a: "Contact your local Office for Senior Citizens Affairs (OSCA). Ask for its current application form, requirements, and processing schedule.",
  },
  {
    q: "Where can I ask about social pension?",
    a: "Start with your local OSCA or social welfare office. They can explain current eligibility criteria and application procedures.",
  },
  {
    q: "What documents should I bring?",
    a: "Requirements depend on the service. Contact the responsible office for its current official checklist before visiting.",
  },
  {
    q: "Can I submit an assistance request here?",
    a: "Yes, you can save a request in this prototype on this browser. It is not sent to a government office or reviewed by staff.",
  },
  {
    q: "Are the listed benefits guaranteed?",
    a: "No. This prototype provides general guidance only. Eligibility, available programs, and requirements must be confirmed with the responsible office.",
  },
];

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;

  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

export default function Home() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [formName, setFormName] = useState("");
  const [formContact, setFormContact] = useState("");
  const [formService, setFormService] = useState(services[0].title);
  const [formMessage, setFormMessage] = useState("");
  const [formFeedback, setFormFeedback] = useState("");
  const [faqSearch, setFaqSearch] = useState("");
  const [chatQuestion, setChatQuestion] = useState("");
  const [chatAnswer, setChatAnswer] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setBookmarks(readStorage<number[]>("seniorassist-bookmarks", []));
    setRequests(readStorage<Request[]>("seniorassist-requests", []));
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        "seniorassist-bookmarks",
        JSON.stringify(bookmarks)
      );
    } catch {
      // Storage may be unavailable in private browsing.
    }
  }, [bookmarks]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        "seniorassist-requests",
        JSON.stringify(requests)
      );
    } catch {
      // Storage may be unavailable in private browsing.
    }
  }, [requests]);

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const matchesCategory =
        category === "All" || service.category === category;
      const text =
        `${service.title} ${service.description} ${service.category}`.toLowerCase();
      return matchesCategory && text.includes(search.toLowerCase());
    });
  }, [category, search]);

  const filteredFaqs = faqs.filter((faq) =>
    `${faq.q} ${faq.a}`.toLowerCase().includes(faqSearch.toLowerCase())
  );

  function navigate(tab: string) {
    setActiveTab(tab);
    setSelectedService(null);
    setMobileMenuOpen(false);
    setShowRequestForm(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function toggleBookmark(id: number) {
    setBookmarks((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  }

  function submitRequest(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const request: Request = {
      id: `SA-${Date.now().toString().slice(-8)}`,
      name: formName.trim(),
      contact: formContact.trim(),
      service: formService,
      message: formMessage.trim(),
      date: new Date().toLocaleDateString(),
    };

    setRequests((current) => [request, ...current]);
    setFormFeedback(
      `Request ${request.id} saved on this device. It has NOT been sent to an office.`
    );
    setFormName("");
    setFormContact("");
    setFormMessage("");
    setShowRequestForm(false);
  }

  function answerQuestion(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const input = chatQuestion.toLowerCase();

    const match = faqs.find((faq) => {
      const terms = faq.q.toLowerCase().split(/\W+/).filter((word) => word.length > 3);
      return terms.some((word) => input.includes(word));
    });

    if (input.includes("pension")) {
      setChatAnswer(faqs[1].a);
    } else if (input.includes("id") || input.includes("identification")) {
      setChatAnswer(faqs[0].a);
    } else if (input.includes("document") || input.includes("requirement")) {
      setChatAnswer(faqs[2].a);
    } else {
      setChatAnswer(
        match?.a ??
          "I can provide general guidance about senior citizen IDs, social pension, documents, and assistance requests. Please contact your local office to verify official information."
      );
    }
  }

  const navItems = [
    { name: "Dashboard", icon: "🏠" },
    { name: "Services", icon: "🧭" },
    { name: "Saved Services", icon: "⭐" },
    { name: "Announcements", icon: "📢" },
    { name: "Ask SeniorAssist", icon: "💬" },
    { name: "My Requests", icon: "📝" },
    { name: "About", icon: "ℹ️" },
  ];

  const displayedServices =
    activeTab === "Saved Services"
      ? filteredServices.filter((service) => bookmarks.includes(service.id))
      : filteredServices;

  return (
    <main className="min-h-screen bg-[#f5f7f2] text-gray-800 md:flex">
      <aside className="hidden w-64 shrink-0 flex-col bg-[#174d38] p-5 text-white md:flex md:min-h-screen">
        <div className="mb-8 px-2">
          <div className="text-3xl">🌿</div>
          <h1 className="mt-2 text-2xl font-bold">SeniorAssist</h1>
          <p className="mt-1 text-xs leading-5 text-green-100">
            Senior citizen assistance portal
          </p>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => navigate(item.name)}
              className={`w-full rounded-xl px-3 py-3 text-left text-sm font-medium transition ${
                activeTab === item.name
                  ? "bg-white text-[#174d38]"
                  : "text-green-50 hover:bg-white/10"
              }`}
            >
              <span>{item.icon}</span>
              <span className="ml-3">{item.name}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto rounded-2xl bg-white/10 p-4">
          <p className="font-semibold">Need assistance?</p>
          <p className="mt-2 text-sm leading-6 text-green-100">
            Contact your local OSCA or the relevant government office for
            official information.
          </p>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/95 px-4 py-3 backdrop-blur md:hidden">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate("Dashboard")}
              className="text-lg font-bold text-[#174d38]"
            >
              🌿 SeniorAssist
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg border px-3 py-2"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? "✕ Close" : "☰ Menu"}
            </button>
          </div>
          {mobileMenuOpen && (
            <nav className="mt-3 grid grid-cols-2 gap-2">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => navigate(item.name)}
                  className="rounded-lg bg-green-50 p-3 text-left text-sm font-medium text-[#174d38]"
                >
                  {item.icon} {item.name}
                </button>
              ))}
            </nav>
          )}
        </header>

        <div className="mx-auto max-w-7xl p-4 sm:p-6 md:p-10">
          <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#397354]">
                SENIOR CITIZEN SUPPORT PORTAL
              </p>
              <h2 className="mt-2 text-3xl font-bold md:text-4xl">
                {activeTab === "Dashboard"
                  ? "Welcome to SeniorAssist"
                  : activeTab}
              </h2>
              <p className="mt-2 max-w-2xl text-gray-600">
                {activeTab === "Dashboard"
                  ? "Find helpful information and community services in one place."
                  : "Browse information and tools designed to help you get started."}
              </p>
            </div>
            <div className="rounded-full bg-white px-4 py-3 text-sm shadow-sm">
              👤 <span className="ml-2 font-medium">Guest User</span>
            </div>
          </header>

          {formFeedback && (
            <div
              role="status"
              className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-900"
            >
              {formFeedback}
              <button
                onClick={() => setFormFeedback("")}
                className="ml-3 font-bold underline"
              >
                Dismiss
              </button>
            </div>
          )}

          {activeTab === "Dashboard" && (
            <>
              <section className="rounded-3xl bg-[#1d6547] p-6 text-white md:p-9">
                <p className="text-xs font-bold uppercase tracking-widest text-green-100">
                  Here to help
                </p>
                <h3 className="mt-3 max-w-2xl text-2xl font-bold md:text-3xl">
                  Senior citizen information, made easier to find.
                </h3>
                <p className="mt-3 max-w-2xl leading-7 text-green-50">
                  Explore assistance programs, review common requirements,
                  and find guidance on where to ask for help.
                </p>
                <button
                  onClick={() => navigate("Services")}
                  className="mt-6 rounded-xl bg-white px-5 py-3 font-bold text-[#174d38] hover:bg-green-50"
                >
                  Explore Services →
                </button>
              </section>

              <section className="my-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  { icon: "📚", value: "06", label: "Information Topics" },
                  { icon: "🧩", value: "04", label: "Categories" },
                  { icon: "⭐", value: String(bookmarks.length).padStart(2, "0"), label: "Saved Services" },
                  { icon: "📝", value: String(requests.length).padStart(2, "0"), label: "Local Requests" },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-500">{item.label}</p>
                      <span className="text-xl">{item.icon}</span>
                    </div>
                    <p className="mt-3 text-3xl font-bold text-[#174d38]">{item.value}</p>
                  </div>
                ))}
              </section>

              <section className="mb-8">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h3 className="text-xl font-bold">Popular Services</h3>
                  <button onClick={() => navigate("Services")} className="text-sm font-bold text-[#1d6547]">
                    View all →
                  </button>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {services.slice(0, 3).map((service) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      saved={bookmarks.includes(service.id)}
                      onSave={() => toggleBookmark(service.id)}
                      onOpen={() => {
                        setSelectedService(service);
                        setActiveTab("Services");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    />
                  ))}
                </div>
              </section>

              <section className="rounded-2xl border border-green-100 bg-white p-5">
                <h3 className="text-lg font-bold">📣 Stay informed</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Verify current program schedules and requirements with your
                  local office before acting on information.
                </p>
                <button
                  onClick={() => navigate("Announcements")}
                  className="mt-3 font-semibold text-[#1d6547]"
                >
                  View announcements →
                </button>
              </section>
            </>
          )}

          {(activeTab === "Services" || activeTab === "Saved Services") && (
            <section>
              {selectedService ? (
                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-8">
                  <button
                    onClick={() => setSelectedService(null)}
                    className="mb-6 font-semibold text-[#1d6547] hover:underline"
                  >
                    ← Back to services
                  </button>
                  <div className="text-5xl">{selectedService.icon}</div>
                  <p className="mt-5 text-xs font-bold uppercase tracking-widest text-[#397354]">
                    {selectedService.category}
                  </p>
                  <h3 className="mt-2 text-3xl font-bold">{selectedService.title}</h3>
                  <p className="mt-3 leading-7 text-gray-600">{selectedService.description}</p>

                  <h4 className="mt-8 text-lg font-bold">What you can do</h4>
                  <ul className="mt-3 space-y-3">
                    {selectedService.details.map((detail) => (
                      <li key={detail} className="flex gap-3 text-sm leading-6">
                        <span className="text-green-700">✓</span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>

                  <h4 className="mt-8 text-lg font-bold">Common preparation checklist</h4>
                  <ul className="mt-3 space-y-3">
                    {selectedService.requirements.map((requirement) => (
                      <li key={requirement} className="flex gap-3 text-sm leading-6">
                        <span className="text-green-700">✓</span>
                        <span>{requirement}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8 rounded-xl bg-green-50 p-5">
                    <h4 className="font-bold text-[#174d38]">Where to ask</h4>
                    <p className="mt-2 text-sm leading-6">{selectedService.office}</p>
                  </div>

                  <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
                    <strong>Important:</strong> This is general prototype guidance,
                    not an official determination of eligibility or requirements.
                    Verify all details with the responsible office.
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      onClick={() => toggleBookmark(selectedService.id)}
                      className="rounded-xl border border-[#1d6547] px-5 py-3 font-semibold text-[#1d6547]"
                    >
                      {bookmarks.includes(selectedService.id) ? "★ Saved" : "☆ Save service"}
                    </button>
                    <button
                      onClick={() => {
                        setFormService(selectedService.title);
                        setShowRequestForm(true);
                        setFormFeedback("");
                      }}
                      className="rounded-xl bg-[#1d6547] px-5 py-3 font-semibold text-white"
                    >
                      Create local request
                    </button>
                  </div>
                  {showRequestForm && <RequestForm
                    formName={formName}
                    setFormName={setFormName}
                    formContact={formContact}
                    setFormContact={setFormContact}
                    formService={formService}
                    setFormService={setFormService}
                    formMessage={formMessage}
                    setFormMessage={setFormMessage}
                    onSubmit={submitRequest}
                    onCancel={() => setShowRequestForm(false)}
                  />}
                </div>
              ) : (
                <>
                  <div className="mb-5 flex flex-wrap gap-2">
                    {categories.map((item) => (
                      <button
                        key={item}
                        onClick={() => setCategory(item)}
                        className={`rounded-full px-4 py-2 text-sm font-semibold ${
                          category === item
                            ? "bg-[#1d6547] text-white"
                            : "border border-gray-200 bg-white hover:bg-green-50"
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>

                  <label className="mb-6 flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3">
                    🔎
                    <input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search services..."
                      className="w-full bg-transparent py-1 outline-none"
                    />
                    {search && (
                      <button onClick={() => setSearch("")} className="text-sm font-bold text-[#1d6547]">
                        Clear
                      </button>
                    )}
                  </label>

                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {displayedServices.map((service) => (
                      <ServiceCard
                        key={service.id}
                        service={service}
                        saved={bookmarks.includes(service.id)}
                        onSave={() => toggleBookmark(service.id)}
                        onOpen={() => setSelectedService(service)}
                      />
                    ))}
                  </div>

                  {displayedServices.length === 0 && (
                    <div className="rounded-2xl bg-white p-8 text-center">
                      <p className="font-bold">No services found.</p>
                      <p className="mt-2 text-sm text-gray-600">
                        Try another search or category.
                      </p>
                    </div>
                  )}
                </>
              )}
            </section>
          )}

          {activeTab === "Announcements" && (
            <section className="space-y-4">
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6">
                These are general reminders, not verified government announcements.
              </div>
              {initialAnnouncements.map((announcement) => (
                <article key={announcement.title} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                  <p className="text-xs font-semibold text-[#397354]">{announcement.date}</p>
                  <h3 className="mt-2 text-lg font-bold">{announcement.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600">{announcement.text}</p>
                </article>
              ))}
            </section>
          )}

          {activeTab === "Ask SeniorAssist" && (
            <section className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-7">
                <div className="text-3xl">💬</div>
                <h3 className="mt-3 text-xl font-bold">Ask SeniorAssist</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Ask a basic question about services or requirements. This demo
                  uses predefined answers and is not connected to a live AI model.
                </p>
                <form onSubmit={answerQuestion} className="mt-5 space-y-3">
                  <label htmlFor="chat-question" className="block text-sm font-semibold">
                    Your question
                  </label>
                  <textarea
                    id="chat-question"
                    required
                    value={chatQuestion}
                    onChange={(event) => setChatQuestion(event.target.value)}
                    placeholder="Example: How do I ask about social pension?"
                    rows={3}
                    className="w-full rounded-xl border border-gray-200 p-3 outline-none focus:border-green-700"
                  />
                  <button className="rounded-xl bg-[#1d6547] px-5 py-3 font-semibold text-white">
                    Get guidance
                  </button>
                </form>
                {chatAnswer && (
                  <div className="mt-5 rounded-xl bg-green-50 p-4">
                    <p className="font-bold text-[#174d38]">Suggested guidance</p>
                    <p className="mt-2 text-sm leading-6">{chatAnswer}</p>
                    <p className="mt-3 text-xs leading-5 text-gray-600">
                      Please verify the answer with the responsible office.
                    </p>
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-7">
                <h3 className="text-xl font-bold">Frequently Asked Questions</h3>
                <label className="mt-4 flex gap-2 rounded-xl border border-gray-200 px-3 py-2">
                  🔎
                  <input
                    value={faqSearch}
                    onChange={(event) => setFaqSearch(event.target.value)}
                    placeholder="Search FAQs..."
                    className="w-full outline-none"
                  />
                </label>
                <div className="mt-4 space-y-3">
                  {filteredFaqs.map((faq) => (
                    <details key={faq.q} className="rounded-xl bg-gray-50 p-4">
                      <summary className="cursor-pointer font-semibold">{faq.q}</summary>
                      <p className="mt-3 text-sm leading-6 text-gray-600">{faq.a}</p>
                    </details>
                  ))}
                  {filteredFaqs.length === 0 && (
                    <p className="text-sm text-gray-500">No matching FAQs.</p>
                  )}
                </div>
              </div>
            </section>
          )}

          {activeTab === "My Requests" && (
            <section>
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm leading-6 text-gray-600">
                  Requests are saved only in this browser on this device.
                  They are not transmitted to any office.
                </p>
                <button
                  onClick={() => {
                    setShowRequestForm(!showRequestForm);
                    setFormFeedback("");
                  }}
                  className="rounded-xl bg-[#1d6547] px-4 py-3 font-semibold text-white"
                >
                  + New request
                </button>
              </div>

              {showRequestForm && <RequestForm
                formName={formName}
                setFormName={setFormName}
                formContact={formContact}
                setFormContact={setFormContact}
                formService={formService}
                setFormService={setFormService}
                formMessage={formMessage}
                setFormMessage={setFormMessage}
                onSubmit={submitRequest}
                onCancel={() => setShowRequestForm(false)}
              />}

              {requests.length === 0 ? (
                <div className="rounded-2xl bg-white p-10 text-center">
                  <div className="text-4xl">📝</div>
                  <h3 className="mt-3 text-lg font-bold">No requests yet</h3>
                  <p className="mt-2 text-sm text-gray-600">
                    Create a local request to test this prototype.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {requests.map((request) => (
                    <article key={request.id} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h3 className="font-bold">{request.service}</h3>
                          <p className="mt-1 text-xs text-gray-500">
                            {request.id} · {request.date}
                          </p>
                        </div>
                        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">
                          Saved locally
                        </span>
                      </div>
                      <p className="mt-3 text-sm text-gray-700">Name: {request.name}</p>
                      <p className="mt-1 text-sm text-gray-700">Contact: {request.contact}</p>
                      <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-gray-600">
                        {request.message || "No additional details provided."}
                      </p>
                      <button
                        onClick={() => setRequests((current) => current.filter((item) => item.id !== request.id))}
                        className="mt-4 text-sm font-semibold text-red-700 hover:underline"
                      >
                        Delete local request
                      </button>
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}

          {activeTab === "About" && (
            <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
              <div className="text-4xl">🌿</div>
              <h3 className="mt-4 text-2xl font-bold">About SeniorAssist</h3>
              <p className="mt-3 leading-7 text-gray-600">
                SeniorAssist is a student project prototype intended to make
                senior citizen service information easier to browse and understand.
              </p>
              <h4 className="mt-6 font-bold">Prototype features</h4>
              <ul className="mt-3 list-inside list-disc space-y-2 text-sm leading-6 text-gray-600">
                <li>Searchable service information and category filters.</li>
                <li>Bookmarks stored in the current browser.</li>
                <li>Local demonstration request form.</li>
                <li>Predefined FAQ guidance.</li>
              </ul>
              <div className="mt-6 rounded-xl bg-amber-50 p-4 text-sm leading-6 text-amber-950">
                <strong>Privacy note:</strong> Do not enter real sensitive personal
                information. Local browser data is not a secure case-management
                system. This prototype is not an official government service.
              </div>
            </section>
          )}

          <footer className="mt-12 border-t border-gray-200 py-6 text-center text-xs leading-6 text-gray-500">
            SeniorAssist · Student project prototype
            <br />
            Verify eligibility, requirements, and announcements with official offices.
          </footer>
        </div>
      </div>
    </main>
  );
}

function ServiceCard({
  service,
  saved,
  onSave,
  onOpen,
}: {
  service: Service;
  saved: boolean;
  onSave: () => void;
  onOpen: () => void;
}) {
  return (
    <article className="flex flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-2xl">
          {service.icon}
        </div>
        <button
          onClick={onSave}
          aria-label={saved ? "Remove bookmark" : "Bookmark service"}
          title={saved ? "Remove bookmark" : "Bookmark service"}
          className="rounded-lg px-2 py-1 text-xl hover:bg-green-50"
        >
          {saved ? "★" : "☆"}
        </button>
      </div>
      <p className="mt-4 text-xs font-bold uppercase tracking-wide text-[#397354]">
        {service.category}
      </p>
      <h3 className="mt-2 text-lg font-bold">{service.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-6 text-gray-600">
        {service.description}
      </p>
      <button
        onClick={onOpen}
        className="mt-5 self-start font-semibold text-[#1d6547] hover:underline"
      >
        View information →
      </button>
    </article>
  );
}

function RequestForm({
  formName,
  setFormName,
  formContact,
  setFormContact,
  formService,
  setFormService,
  formMessage,
  setFormMessage,
  onSubmit,
  onCancel,
}: {
  formName: string;
  setFormName: (value: string) => void;
  formContact: string;
  setFormContact: (value: string) => void;
  formService: string;
  setFormService: (value: string) => void;
  formMessage: string;
  setFormMessage: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="mt-6 space-y-4 rounded-2xl border border-green-100 bg-green-50/50 p-5"
    >
      <div>
        <h3 className="text-lg font-bold">Assistance request form</h3>
        <p className="mt-1 text-xs leading-5 text-gray-600">
          Demo only: avoid real sensitive information. The request is saved locally,
          not submitted to an office.
        </p>
      </div>

      <div>
        <label htmlFor="request-name" className="mb-1 block text-sm font-semibold">
          Name for this demo *
        </label>
        <input
          id="request-name"
          required
          maxLength={100}
          value={formName}
          onChange={(event) => setFormName(event.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-white p-3 outline-none focus:border-green-700"
          placeholder="Enter a test name"
        />
      </div>

      <div>
        <label htmlFor="request-contact" className="mb-1 block text-sm font-semibold">
          Contact reference *
        </label>
        <input
          id="request-contact"
          required
          maxLength={100}
          value={formContact}
          onChange={(event) => setFormContact(event.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-white p-3 outline-none focus:border-green-700"
          placeholder="Use a dummy email or phone number"
        />
      </div>

      <div>
        <label htmlFor="request-service" className="mb-1 block text-sm font-semibold">
          Service *
        </label>
        <select
          id="request-service"
          value={formService}
          onChange={(event) => setFormService(event.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-white p-3"
        >
          {services.map((service) => (
            <option key={service.id} value={service.title}>
              {service.title}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="request-message" className="mb-1 block text-sm font-semibold">
          Additional details
        </label>
        <textarea
          id="request-message"
          rows={3}
          maxLength={1000}
          value={formMessage}
          onChange={(event) => setFormMessage(event.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-white p-3 outline-none focus:border-green-700"
          placeholder="Describe the demo request (no sensitive details)"
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          className="rounded-xl bg-[#1d6547] px-5 py-3 font-semibold text-white"
        >
          Save demo request
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-gray-300 bg-white px-5 py-3 font-semibold"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
