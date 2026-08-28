import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthDialog } from "@/components/AuthDialog";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
  NavbarLogo,
  NavbarButton,
} from "@/components/ui/resizable-navbar";

const NAV_ITEMS = [
  { name: "Inicio", link: "#inicio" },
  { name: "Cómo funciona", link: "#como" },
  { name: "Para cada ocasión", link: "#ocasiones" },
  { name: "Beneficios", link: "#beneficios" },
];

export function LandingNavbar({
  authOpen,
  setAuthOpen,
}: {
  authOpen: boolean;
  setAuthOpen: (v: boolean) => void;
}) {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <Navbar>
        <NavBody>
          <NavbarLogo />
          <NavItems items={NAV_ITEMS} />
          <div className="flex items-center gap-3">
            <NavbarButton
              variant="secondary"
              as="button"
              onClick={() => navigate("/live")}
            >
              Practicar en vivo
            </NavbarButton>
            <NavbarButton
              variant="primary"
              as="button"
              onClick={() => setAuthOpen(true)}
            >
              Crear cuenta
            </NavbarButton>
          </div>
        </NavBody>

        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={mobileOpen}
              onClick={() => setMobileOpen((o) => !o)}
            />
          </MobileNavHeader>
          <MobileNavMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)}>
            {NAV_ITEMS.map((item) => (
              <NavbarButton
                key={item.link}
                as="a"
                href={item.link}
                variant="secondary"
                onClick={() => setMobileOpen(false)}
                className="w-full"
              >
                {item.name}
              </NavbarButton>
            ))}
            <NavbarButton
              as="button"
              variant="secondary"
              onClick={() => {
                setMobileOpen(false);
                navigate("/live");
              }}
              className="w-full"
            >
              Practicar en vivo
            </NavbarButton>
            <NavbarButton
              as="button"
              variant="primary"
              onClick={() => {
                setMobileOpen(false);
                setAuthOpen(true);
              }}
              className="w-full"
            >
              Crear cuenta
            </NavbarButton>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>

      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
    </>
  );
}
