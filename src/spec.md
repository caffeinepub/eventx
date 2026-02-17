# Specification

## Summary
**Goal:** Extend role-based user profiles for organizers and exhibitors/artists, and make in-app announcements easier to find from Home.

**Planned changes:**
- Backend: extend the `UserProfile` model to include organizer fields (CNPJ/CPF, Empresa) and exhibitor/artist field (Portfolio/Social Media URL), keeping them optional and compatible with existing callers.
- Frontend: update the profile setup/edit flow to support selecting the Expositor/Artista role and to show/save the new role-specific fields, with all new/changed strings coming from the existing pt-BR i18n system.
- Frontend: add a prominent Home-screen announcements entry point (notification bell or equivalent) that indicates when announcements exist and takes the user to the announcements list/section.
- Frontend: rename the bottom tab label from “Programação” to “Eventos” via i18n without changing routing behavior.

**User-visible outcome:** Users can choose Organizador, Expositor/Artista, or Participante and fill in the appropriate profile fields; Home shows a clear announcements control that highlights when there are updates; the bottom navigation displays “Eventos” instead of “Programação”.
