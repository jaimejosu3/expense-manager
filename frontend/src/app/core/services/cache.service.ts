import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class CacheService {
    private cache = new Map<string, CacheEntry>();
    private readonly MAX_CACHE_AGE = 5 * 60 * 1000; // 5 minutos

    get(url: string): HttpResponse<any> | undefined {
        const cached = this.cache.get(url);

        if (!cached) {
            return undefined;
        }

        const isExpired = cached.lastRead < (Date.now() - this.MAX_CACHE_AGE);
        if (isExpired) {
            this.cache.delete(url);
            return undefined;
        }

        return cached.response;
    }

    set(url: string, response: HttpResponse<any>): void {
        const entry: CacheEntry = {
            url,
            response,
            lastRead: Date.now()
        };
        this.cache.set(url, entry);
        this.cleanup();
    }

    private cleanup(): void {
        const expired = Date.now() - this.MAX_CACHE_AGE;
        this.cache.forEach((entry, key) => {
            if (entry.lastRead < expired) {
                this.cache.delete(key);
            }
        });
    }
}

interface CacheEntry {
    url: string;
    response: HttpResponse<any>;
    lastRead: number;
}