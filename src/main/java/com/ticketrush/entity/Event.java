package com.ticketrush.entity;

import com.ticketrush.enums.EventStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "events")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 200)
    private String venue;

    @Column(length = 500)
    private String address;

    private String bannerUrl;

    @Column(length = 100)
    private String category;

    @Column(length = 100)
    private String city;

    @Column(nullable = false)
    private LocalDateTime eventDate;

    private LocalDateTime saleStartTime;

    private LocalDateTime saleEndTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private EventStatus status;

    @Column(nullable = false)
    @Builder.Default
    private boolean queueEnabled = false;

    @Column(nullable = false)
    @Builder.Default
    private int queueBatchSize = 50;

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Zone> zones = new ArrayList<>();

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null) {
            status = EventStatus.DRAFT;
        }
    }
}
