package com.g6.acrobatteAPI.configuration;

import java.io.IOException;

import org.apache.logging.log4j.Level;
import org.apache.logging.log4j.core.LoggerContext;
import org.apache.logging.log4j.core.config.Configuration;
import org.apache.logging.log4j.core.config.ConfigurationFactory;
import org.apache.logging.log4j.core.config.ConfigurationSource;
import org.apache.logging.log4j.core.config.Configurator;
import org.apache.logging.log4j.core.config.Order;
import org.apache.logging.log4j.core.config.builder.api.AppenderComponentBuilder;
import org.apache.logging.log4j.core.config.builder.api.ConfigurationBuilder;
import org.apache.logging.log4j.core.config.builder.api.ConfigurationBuilderFactory;
import org.apache.logging.log4j.core.config.builder.api.LayoutComponentBuilder;
import org.apache.logging.log4j.core.config.builder.api.RootLoggerComponentBuilder;
import org.apache.logging.log4j.core.config.builder.impl.BuiltConfiguration;
import org.apache.logging.log4j.core.config.plugins.Plugin;

// @Plugin(name = "Log4JConfiguration", category = ConfigurationFactory.CATEGORY)
// @Order(50)
public class Log4JConfiguration extends ConfigurationFactory {

    @Override
    public Configuration getConfiguration(LoggerContext arg0, ConfigurationSource arg1) {
        ConfigurationBuilder<BuiltConfiguration> builder = ConfigurationBuilderFactory.newConfigurationBuilder();

        AppenderComponentBuilder file = builder.newAppender("log", "File");
        file.addAttribute("fileName", "target/TESTLOGGING.log");
        builder.add(file);

        LayoutComponentBuilder standard = builder.newLayout("PatternLayout");
        standard.addAttribute("pattern", "%d [%t] %-5level: %msg%n%throwable");

        file.add(standard);

        RootLoggerComponentBuilder rootLogger = builder.newRootLogger(Level.ERROR);
        rootLogger.add(builder.newAppenderRef("stdout"));

        builder.add(rootLogger);

        try {
            builder.writeXmlConfiguration(System.out);
        } catch (IOException e) {
            e.printStackTrace();
        }

        // Configurator.initialize(builder.build());

        return builder.build();
    }

    @Override
    public String[] getSupportedTypes() {
        return new String[] { "*" };
    }

}
