import { beforeEach, describe, expect, it } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { LanguageProvider } from "@/i18n/LanguageContext";
import Index from "@/pages/Index";
import Contact from "@/pages/Contact";
import { TestProviders } from "@/test/test-utils";

function SearchParamsEcho() {
  const location = useLocation();
  return <div>{location.search}</div>;
}

describe("home and contact regressions", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.dir = "ltr";
    document.documentElement.lang = "en";
  });

  it("keeps index search navigation query behavior", async () => {
    render(
      <TestProviders>
        <LanguageProvider>
          <MemoryRouter
            initialEntries={["/"]}
            future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
          >
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/listings" element={<SearchParamsEcho />} />
            </Routes>
          </MemoryRouter>
        </LanguageProvider>
      </TestProviders>,
    );

    await waitFor(() => {
      expect(screen.getByPlaceholderText("Search properties...")).toBeInTheDocument();
    });
    fireEvent.change(screen.getByPlaceholderText("Search properties..."), {
      target: { value: "villa" },
    });
    const filters = screen.getAllByRole("combobox");
    fireEvent.change(filters[0], { target: { value: "sale" } });
    fireEvent.change(filters[1], { target: { value: "tlemcen" } });
    fireEvent.click(screen.getByRole("button", { name: "Search" }));

    expect(screen.getByText("?q=villa&type=sale&city=tlemcen")).toBeInTheDocument();
  });

  it("resets contact form after submit", async () => {
    render(
      <TestProviders>
        <LanguageProvider>
          <MemoryRouter
            initialEntries={["/contact"]}
            future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
          >
            <Contact />
          </MemoryRouter>
        </LanguageProvider>
      </TestProviders>,
    );

    const nameInput = screen.getByLabelText("Your Name") as HTMLInputElement;
    const emailInput = screen.getByLabelText("Your Email") as HTMLInputElement;
    const subjectInput = screen.getByLabelText("Subject") as HTMLInputElement;
    const messageInput = screen.getByLabelText("Message") as HTMLTextAreaElement;

    fireEvent.change(nameInput, { target: { value: "Alice" } });
    fireEvent.change(emailInput, { target: { value: "alice@example.com" } });
    fireEvent.change(subjectInput, { target: { value: "Question" } });
    fireEvent.change(messageInput, { target: { value: "Hello there" } });
    fireEvent.click(screen.getByRole("button", { name: "Send" }));

    await waitFor(() => {
      expect(nameInput.value).toBe("");
      expect(emailInput.value).toBe("");
      expect(subjectInput.value).toBe("");
      expect(messageInput.value).toBe("");
    });
  });
});
