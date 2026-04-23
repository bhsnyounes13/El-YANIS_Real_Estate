import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PropertyCard from "@/components/PropertyCard";
import { demoProperties as properties } from "@/test/fixtures/demoCatalog";
import { LanguageProvider, useLanguage } from "@/i18n/LanguageContext";

function LanguageProbe() {
  const { t, dir } = useLanguage();
  return (
    <div>
      <span>{t("nav.home")}</span>
      <span>{t("missing.translation.key")}</span>
      <span>{dir}</span>
    </div>
  );
}

describe("ui behavior safeguards", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.dir = "ltr";
    document.documentElement.lang = "en";
  });

  it("uses saved language and keeps fallback translation behavior", () => {
    localStorage.setItem("el-yanis-lang", "fr");

    render(
      <LanguageProvider>
        <LanguageProbe />
      </LanguageProvider>,
    );

    expect(screen.getByText("Accueil")).toBeInTheDocument();
    expect(screen.getByText("missing.translation.key")).toBeInTheDocument();
    expect(screen.getByText("ltr")).toBeInTheDocument();
  });

  it("renders property card in French with rent month suffix", () => {
    localStorage.setItem("el-yanis-lang", "fr");
    const rentProperty = properties.find((property) => property.type === "rent");

    if (!rentProperty) {
      throw new Error("Expected at least one rent property in mock data");
    }

    render(
      <LanguageProvider>
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <PropertyCard property={rentProperty} />
        </MemoryRouter>
      </LanguageProvider>,
    );

    expect(
      screen.getByText(new RegExp(rentProperty.title_fr.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))),
    ).toBeInTheDocument();
    expect(screen.getByText("À louer")).toBeInTheDocument();
    expect(screen.getByText("/mois")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: rentProperty.title_fr })).toHaveAttribute(
      "href",
      `/property/${rentProperty.id}`,
    );
  });
});
