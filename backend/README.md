# Invitation API (optional)

The invitation in this repo does not read from this service. Every name, date
and venue is written into `components/Invitation.jsx`, so the site builds and
deploys on its own and this folder can be deleted without affecting it.

It is kept for one reason: if you later want the same design to serve several
weddings off one deployment, this is the slice of the old backend that did it
- a Mongo-backed store of invitations keyed by subdomain.

To use it, the component would take its content from props again (it already
accepts a `data` prop and currently ignores it), and the page would fetch
`/api/invitations/<subdomain>` before rendering.

    cp .env.example .env     # fill in MONGO_URI
    npm install
    npm run dev

Note that this is a long-running Express server. Vercel does not host one;
it would go to Render, Railway, Fly or similar, with the Next.js site calling
it over the network.
