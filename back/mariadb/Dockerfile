FROM mariadb:10.7.3
RUN echo "USE mysql;" > /docker-entrypoint-initdb.d/timezones.sql &&  mysql_tzinfo_to_sql /usr/share/zoneinfo >> /docker-entrypoint-initdb.d/timezones.sql
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
