package com.g6.acrobatteAPI.entities.events;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

import lombok.Data;

@Entity
@DiscriminatorValue("GenericEvent")
@Data
public class GenericEvent extends Event {

}
