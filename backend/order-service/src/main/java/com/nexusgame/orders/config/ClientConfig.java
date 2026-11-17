package com.nexusgame.orders.config;

import com.nexusgame.orders.client.CatalogoClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.support.RestClientAdapter;
import org.springframework.web.service.invoker.HttpServiceProxyFactory;

@Configuration
public class ClientConfig {

    @Bean
    CatalogoClient catalogoClient(RestClient.Builder builder,
                                  @Value("${clients.catalog-service.url}") String baseUrl) {
        RestClient restClient = builder.baseUrl(baseUrl).build();
        return HttpServiceProxyFactory.builderFor(RestClientAdapter.create(restClient))
                .build()
                .createClient(CatalogoClient.class);
    }
}
