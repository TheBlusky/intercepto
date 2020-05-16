FROM node:latest
RUN mkdir /app/
COPY frontend /app/frontend/
WORKDIR /app/frontend/
RUN npm install
RUN npm run build

FROM python:latest
RUN pip install --upgrade pip
RUN mkdir /app/
RUN mkdir /app/backend/
RUN mkdir /app/frontend/
COPY --from=0 /app/frontend/build/ /app/frontend/build/
COPY backend /app/backend/
COPY utils /app/utils/
RUN useradd -m worker
USER worker
WORKDIR /app/backend/
RUN pip install --user -r requirements.txt
ENV INTERCEPTO_STATIC TRUE
CMD ["python", "-m", "uvicorn", "--host", "0.0.0.0", "intercepto:app"]
EXPOSE 8000
