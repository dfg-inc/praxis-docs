FROM node:22-bookworm-slim
WORKDIR /workspace
COPY docs/user ./docs/user
COPY apps/docs-site ./apps/docs-site
WORKDIR /workspace/apps/docs-site
RUN npm install && npm run build
EXPOSE 4174
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "4174"]
