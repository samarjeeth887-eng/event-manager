# Multi-stage build for Spring Boot Backend
FROM eclipse-temurin:21-jdk-jammy AS build
WORKDIR /app

# Copy Maven wrapper and dependencies
COPY backend/pom.xml backend/mvnw ./
COPY backend/.mvn ./.mvn
RUN chmod +x ./mvnw && ./mvnw dependency:go-offline -B

# Copy source and build jar
COPY backend/src ./src
RUN ./mvnw clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080
ENV PORT=8080

ENTRYPOINT ["java", "-jar", "app.jar"]
