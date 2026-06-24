FROM maven:3.9.11-eclipse-temurin-21 AS build
WORKDIR /workspace
COPY pom.xml .
RUN mvn -B -q dependency:go-offline
COPY src ./src
RUN mvn -B -q clean package -DskipTests

FROM eclipse-temurin:21-jre
WORKDIR /app
RUN useradd --system --uid 1001 bordersync
COPY --from=build /workspace/target/backend-*.jar app.jar
USER bordersync
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
