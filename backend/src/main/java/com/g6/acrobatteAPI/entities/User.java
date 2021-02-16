package com.g6.acrobatteAPI.entities;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.ManyToMany;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import lombok.Data;

@Data
@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @NotBlank
    private String name;

    @NotBlank
    private String firstName;

    @NotBlank
    @Email
    @Column(unique = true)
    private String email;

    @ManyToMany(mappedBy = "administrators")
    private Set<Challenge> administeredChallenges;

    @ElementCollection(fetch = FetchType.EAGER)
    private List<Role> roles;

    @NotBlank
    private String password;

    @Lob
    private byte[] avatar;

    public User() {
        administeredChallenges = new HashSet<>();
    }

    public User(String name, String firstName, String email) {
        this.name = name;
        this.firstName = firstName;
        this.email = email;
        administeredChallenges = new HashSet<>();
    }

    public User(String name, String firstName, String email, String password) {
        this.name = name;
        this.firstName = firstName;
        this.email = email;
        this.password = password;
        administeredChallenges = new HashSet<>();
    }
}
