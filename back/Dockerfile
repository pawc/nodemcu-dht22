FROM maven:3.8.1-jdk-8 AS build
COPY src /home/app/src
COPY pom.xml /home/app
RUN mvn -f /home/app/pom.xml clean package -DskipTests

FROM openjdk:18

### Locale support pl_PL and timezone Europe/Warsaw ###
USER root
RUN echo "Europe/Warsaw" > /etc/timezone
ENV TZ=Europe/Warsaw
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# RUN localedef -i pl_PL -f UTF-8 pl_PL.UTF-8
RUN echo "LANG=\"pl_PL.UTF-8\"" > /etc/locale.conf
RUN ln -s -f /usr/share/zoneinfo/Europe/Warsaw /etc/localtime

ENV LANG pl_PL.UTF-8
ENV LANGUAGE pl_PL.UTF-8
# ENV LC_ALL pl_PL.UTF-8
### Locale Support END ###

COPY --from=build /home/app/target/arduino-1.0.jar /usr/src/myapp/app.jar
WORKDIR /usr/src/myapp
ENTRYPOINT ["java","-jar","/usr/src/myapp/app.jar"]
EXPOSE 8080