
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function get_store_value(store) {
        let value;
        subscribe(store, _ => value = _)();
        return value;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function set_store_value(store, ret, value) {
        store.set(value);
        return ret;
    }
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function to_number(value) {
        return value === '' ? null : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }
    class HtmlTag {
        constructor() {
            this.e = this.n = null;
        }
        c(html) {
            this.h(html);
        }
        m(html, target, anchor = null) {
            if (!this.e) {
                this.e = element(target.nodeName);
                this.t = target;
                this.c(html);
            }
            this.i(anchor);
        }
        h(html) {
            this.e.innerHTML = html;
            this.n = Array.from(this.e.childNodes);
        }
        i(anchor) {
            for (let i = 0; i < this.n.length; i += 1) {
                insert(this.t, this.n[i], anchor);
            }
        }
        p(html) {
            this.d();
            this.h(html);
            this.i(this.a);
        }
        d() {
            this.n.forEach(detach);
        }
    }

    const active_docs = new Set();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        active_docs.add(doc);
        const stylesheet = doc.__svelte_stylesheet || (doc.__svelte_stylesheet = append_empty_stylesheet(node).sheet);
        const current_rules = doc.__svelte_rules || (doc.__svelte_rules = {});
        if (!current_rules[name]) {
            current_rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            active_docs.forEach(doc => {
                const stylesheet = doc.__svelte_stylesheet;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                doc.__svelte_rules = {};
            });
            active_docs.clear();
        });
    }

    function create_animation(node, from, fn, params) {
        if (!from)
            return noop;
        const to = node.getBoundingClientRect();
        if (from.left === to.left && from.right === to.right && from.top === to.top && from.bottom === to.bottom)
            return noop;
        const { delay = 0, duration = 300, easing = identity, 
        // @ts-ignore todo: should this be separated from destructuring? Or start/end added to public api and documentation?
        start: start_time = now() + delay, 
        // @ts-ignore todo:
        end = start_time + duration, tick = noop, css } = fn(node, { from, to }, params);
        let running = true;
        let started = false;
        let name;
        function start() {
            if (css) {
                name = create_rule(node, 0, 1, duration, delay, easing, css);
            }
            if (!delay) {
                started = true;
            }
        }
        function stop() {
            if (css)
                delete_rule(node, name);
            running = false;
        }
        loop(now => {
            if (!started && now >= start_time) {
                started = true;
            }
            if (started && now >= end) {
                tick(1, 0);
                stop();
            }
            if (!running) {
                return false;
            }
            if (started) {
                const p = now - start_time;
                const t = 0 + 1 * easing(p / duration);
                tick(t, 1 - t);
            }
            return true;
        });
        start();
        tick(0, 1);
        return stop;
    }
    function fix_position(node) {
        const style = getComputedStyle(node);
        if (style.position !== 'absolute' && style.position !== 'fixed') {
            const { width, height } = style;
            const a = node.getBoundingClientRect();
            node.style.position = 'absolute';
            node.style.width = width;
            node.style.height = height;
            add_transform(node, a);
        }
    }
    function add_transform(node, a) {
        const b = node.getBoundingClientRect();
        if (a.left !== b.left || a.top !== b.top) {
            const style = getComputedStyle(node);
            const transform = style.transform === 'none' ? '' : style.transform;
            node.style.transform = `${transform} translate(${a.left - b.left}px, ${a.top - b.top}px)`;
        }
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_bidirectional_transition(node, fn, params, intro) {
        let config = fn(node, params);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = (program.b - t);
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program || pending_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config();
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function fix_and_outro_and_destroy_block(block, lookup) {
        block.f();
        outro_and_destroy_block(block, lookup);
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.44.1' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }
    function sineInOut(t) {
        return -0.5 * (Math.cos(Math.PI * t) - 1);
    }

    function flip(node, { from, to }, params = {}) {
        const style = getComputedStyle(node);
        const transform = style.transform === 'none' ? '' : style.transform;
        const [ox, oy] = style.transformOrigin.split(' ').map(parseFloat);
        const dx = (from.left + from.width * ox / to.width) - (to.left + ox);
        const dy = (from.top + from.height * oy / to.height) - (to.top + oy);
        const { delay = 0, duration = (d) => Math.sqrt(d) * 120, easing = cubicOut } = params;
        return {
            delay,
            duration: is_function(duration) ? duration(Math.sqrt(dx * dx + dy * dy)) : duration,
            easing,
            css: (t, u) => {
                const x = u * dx;
                const y = u * dy;
                const sx = t + u * from.width / to.width;
                const sy = t + u * from.height / to.height;
                return `transform: ${transform} translate(${x}px, ${y}px) scale(${sx}, ${sy});`;
            }
        };
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    /**
     * Svelte store to hold an array of messages
     */
    const messageQueue = writable([]);
    /**
     * How long should each message be displayed in ms
     */
    const messageTime = 4000;
    /**
     * Used to get a unique id for each message
     */
    let idNumber = 0;
    /**
     * Simple class to hold a string and an ID used to display messages to the player.
     * This could be expanded to include icons, sound effects, css classes for animations etc.
     */
    class Message {
        constructor(message) {
            this.message = message;
            this.id = idNumber++;
        }
    }
    /**
     * Function to add a message to the message queue
     * @param message Message to be shown to the player
     */
    function sendMessage(message) {
        // create a message object
        const notification = new Message(message);
        // add the message to the message queue
        messageQueue.update(m => (m = [...m, notification]));
        // create a timeout to automatically remove the message after messageTime elapsed
        setTimeout(() => {
            messageQueue.update(m => (m = m.filter(e => e.id != notification.id)));
        }, messageTime);
    }

    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }
    function fly(node, { delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 } = {}) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
			opacity: ${target_opacity - (od * u)}`
        };
    }
    function slide(node, { delay = 0, duration = 400, easing = cubicOut } = {}) {
        const style = getComputedStyle(node);
        const opacity = +style.opacity;
        const height = parseFloat(style.height);
        const padding_top = parseFloat(style.paddingTop);
        const padding_bottom = parseFloat(style.paddingBottom);
        const margin_top = parseFloat(style.marginTop);
        const margin_bottom = parseFloat(style.marginBottom);
        const border_top_width = parseFloat(style.borderTopWidth);
        const border_bottom_width = parseFloat(style.borderBottomWidth);
        return {
            delay,
            duration,
            easing,
            css: t => 'overflow: hidden;' +
                `opacity: ${Math.min(t * 20, 1) * opacity};` +
                `height: ${t * height}px;` +
                `padding-top: ${t * padding_top}px;` +
                `padding-bottom: ${t * padding_bottom}px;` +
                `margin-top: ${t * margin_top}px;` +
                `margin-bottom: ${t * margin_bottom}px;` +
                `border-top-width: ${t * border_top_width}px;` +
                `border-bottom-width: ${t * border_bottom_width}px;`
        };
    }

    /* src/components/misc/Notification.svelte generated by Svelte v3.44.1 */
    const file$p = "src/components/misc/Notification.svelte";

    function create_fragment$p(ctx) {
    	let span;
    	let t_value = /*message*/ ctx[0].message + "";
    	let t;
    	let span_transition;
    	let current;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(t_value);
    			attr_dev(span, "class", "svelte-161rus3");
    			add_location(span, file$p, 9, 0, 274);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			if ((!current || dirty & /*message*/ 1) && t_value !== (t_value = /*message*/ ctx[0].message + "")) set_data_dev(t, t_value);
    		},
    		i: function intro(local) {
    			if (current) return;

    			if (local) {
    				add_render_callback(() => {
    					if (!span_transition) span_transition = create_bidirectional_transition(span, fly, { x: 200, duration: 500, easing: sineInOut }, true);
    					span_transition.run(1);
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			if (local) {
    				if (!span_transition) span_transition = create_bidirectional_transition(span, fly, { x: 200, duration: 500, easing: sineInOut }, false);
    				span_transition.run(0);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (detaching && span_transition) span_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$p.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$p($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Notification', slots, []);
    	let { message } = $$props;
    	const writable_props = ['message'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Notification> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('message' in $$props) $$invalidate(0, message = $$props.message);
    	};

    	$$self.$capture_state = () => ({ fly, sineInOut, message });

    	$$self.$inject_state = $$props => {
    		if ('message' in $$props) $$invalidate(0, message = $$props.message);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [message];
    }

    class Notification extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$p, create_fragment$p, safe_not_equal, { message: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Notification",
    			options,
    			id: create_fragment$p.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*message*/ ctx[0] === undefined && !('message' in props)) {
    			console.warn("<Notification> was created without expected prop 'message'");
    		}
    	}

    	get message() {
    		throw new Error("<Notification>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set message(value) {
    		throw new Error("<Notification>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/misc/Notifications.svelte generated by Svelte v3.44.1 */
    const file$o = "src/components/misc/Notifications.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (11:2) {#each $messageQueue as message (message.id)}
    function create_each_block$4(key_1, ctx) {
    	let span;
    	let notification;
    	let t;
    	let rect;
    	let stop_animation = noop;
    	let current;

    	notification = new Notification({
    			props: { message: /*message*/ ctx[1] },
    			$$inline: true
    		});

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			span = element("span");
    			create_component(notification.$$.fragment);
    			t = space();
    			attr_dev(span, "class", "svelte-1tllv35");
    			add_location(span, file$o, 11, 4, 382);
    			this.first = span;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			mount_component(notification, span, null);
    			append_dev(span, t);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const notification_changes = {};
    			if (dirty & /*$messageQueue*/ 1) notification_changes.message = /*message*/ ctx[1];
    			notification.$set(notification_changes);
    		},
    		r: function measure() {
    			rect = span.getBoundingClientRect();
    		},
    		f: function fix() {
    			fix_position(span);
    			stop_animation();
    		},
    		a: function animate() {
    			stop_animation();
    			stop_animation = create_animation(span, rect, flip, {});
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(notification.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(notification.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			destroy_component(notification);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(11:2) {#each $messageQueue as message (message.id)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$o(ctx) {
    	let div;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let current;
    	let each_value = /*$messageQueue*/ ctx[0];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*message*/ ctx[1].id;
    	validate_each_keys(ctx, each_value, get_each_context$4, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$4(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$4(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "svelte-1tllv35");
    			add_location(div, file$o, 9, 0, 322);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$messageQueue*/ 1) {
    				each_value = /*$messageQueue*/ ctx[0];
    				validate_each_argument(each_value);
    				group_outros();
    				for (let i = 0; i < each_blocks.length; i += 1) each_blocks[i].r();
    				validate_each_keys(ctx, each_value, get_each_context$4, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div, fix_and_outro_and_destroy_block, create_each_block$4, null, get_each_context$4);
    				for (let i = 0; i < each_blocks.length; i += 1) each_blocks[i].a();
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$o.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$o($$self, $$props, $$invalidate) {
    	let $messageQueue;
    	validate_store(messageQueue, 'messageQueue');
    	component_subscribe($$self, messageQueue, $$value => $$invalidate(0, $messageQueue = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Notifications', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Notifications> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		flip,
    		messageQueue,
    		Notification,
    		$messageQueue
    	});

    	return [$messageQueue];
    }

    class Notifications extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$o, create_fragment$o, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Notifications",
    			options,
    			id: create_fragment$o.name
    		});
    	}
    }

    const suffixes = ['K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'Dc'];
    const OOMs = [1e3, 1e6, 1e9, 1e12, 1e15, 1e18, 1e21, 1e24, 1e27, 1e30, 1e33];
    /**
     * Function to format a number for display on screen.
     * @param input Number to format
     * @param decimals How many decimals do you want
     */
    function formatNumber(input, decimals) {
        if (typeof input !== 'number')
            input = 0;
        if (input < 0)
            return '-' + formatNumber(-1 * input, decimals);
        if (input >= OOMs[suffixes.length])
            return input.toExponential(decimals).replace('+', '');
        for (let i = suffixes.length - 1; i >= 0; i--) {
            if (input >= OOMs[i])
                return (input / OOMs[i]).toFixed(decimals) + suffixes[i];
        }
        return input.toFixed(decimals);
    }
    /**
     * Function to format a number for display on screen.
     * Will only show decimal places when the number is abbreviated.
     * @param input Number to format
     */
    function formatWhole(input) {
        if (typeof input !== 'number')
            input = 0;
        if (input < 0)
            return '-' + formatWhole(-1 * input);
        if (input < 1e3)
            return formatNumber(input, 0);
        return formatNumber(input, 2);
    }
    function formatResourceName(name) {
        if (name === 'moldyCheese')
            return 'moldy cheese';
        if (name === 'cheeseBrains')
            return 'cheese brains';
        return name;
    }
    function formatTime(sec, digits = 2) {
        const hours = Math.floor(sec / 3600);
        const minutes = Math.floor(sec / 60 - 60 * hours);
        const seconds = Math.floor(sec % 60);
        if (sec >= 3600)
            return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        if (sec >= 60)
            return `${minutes}:${seconds.toString().padStart(2, '0')}`;
        if (sec >= 1e-1)
            return `${formatNumber(sec, digits)}s`;
        if (sec >= 1e-4)
            return `${formatNumber(sec * 1000, digits)}ms`;
        return `${formatNumber(sec * 1000, digits)}µs`;
    }
    /**
     * Removes all references to an object or variable.
     * @param obj
     * @returns real copy of obj
     */
    function noRef(obj) {
        return JSON.parse(JSON.stringify(obj));
    }
    function checkBoolForNum(bool, num, or = 1) {
        return bool ? num : or;
    }

    console.log('customStore.ts');
    function makeStore(initialState) {
        // important to wrap it in noRef() !!
        const store = writable(noRef(initialState));
        const refresh = () => {
            store.update($store => $store);
        };
        const reset = () => {
            store.set(noRef(initialState));
        };
        return Object.assign(Object.assign({}, store), { reset, refresh });
    }
    /* export function makeStore2(initialState: unknown) {
      // important to wrap it in noRef() !!
      const store = writable(noRef(initialState))
      const reset = (): void => {
        store.set(noRef(initialState))
      }
      const add = (resource: string, n: number): void => {
        store.update($store => {
          if (typeof $store[resource] === 'number') ($store[resource] as number) += n
        })
        return store
      }
      return { ...store, reset, add }
    } */

    console.log('resources.ts');
    const resource = makeStore({
        thoughts: 0,
        cheese: 0,
        moldyCheese: 0,
        cheeseMonster: 0,
        cheeseBrains: 0,
        milk: 0,
        milkPower: 0,
        milkPoints: 0,
    });

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __classPrivateFieldGet(receiver, state, kind, f) {
        if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
        return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
    }

    function __classPrivateFieldSet(receiver, state, value, kind, f) {
        if (kind === "m") throw new TypeError("Private method is not writable");
        if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
        return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
    }

    var _a, _Upgrade_id;
    console.log('upgrades.ts');
    class Upgrade {
        constructor(resource, cost, costMultiplier, maxBuy = null, bought = 0, title = 'No Title') {
            var _b, _c, _d;
            this.resource = resource;
            this.cost = cost;
            this.costMultiplier = costMultiplier;
            this.maxBuy = maxBuy;
            this.bought = bought;
            this.title = title;
            this.id = (__classPrivateFieldSet(_b = Upgrade, _a, (_d = __classPrivateFieldGet(_b, _a, "f", _Upgrade_id), _c = _d++, _d), "f", _Upgrade_id), _c);
        }
    }
    _a = Upgrade;
    _Upgrade_id = { value: 0 };
    const upgradesInitial = {
        // Cogito Ergo Sum
        thoughtAcceleration: new Upgrade('thoughts', 10, 1.15),
        thoughtJerk: new Upgrade('thoughts', 1e8, 1.3),
        thoughtBoostStrength: new Upgrade('thoughts', 100, 2),
        thoughtBoostDuration: new Upgrade('thoughts', 150, 4, 11),
        thoughtBoostStack: new Upgrade('thoughts', 1e7, 5, 9),
        // Switzerland Simulator
        cheeseQueueLength: new Upgrade('cheese', 5, 2),
        cheeseYield: new Upgrade('cheese', 15, 1.3),
        cheeseThoughtMult: new Upgrade('cheese', 300, 2),
        cheeseQueueOverclockingCost: new Upgrade('cheese', 5e3, 1.5),
        // Moldy Cheese
        moldyCheeseConversionExponent: new Upgrade('moldyCheese', 5, 1.5),
        moldyCheeseHalfLife: new Upgrade('moldyCheese', 20, 1.3),
        moldyCheeseChance: new Upgrade('moldyCheese', 200, 2.5, 9),
        cheeseMonsterSpawnrate: new Upgrade('moldyCheese', 250, 2.0),
        cheeseMonsterCapacity: new Upgrade('moldyCheese', 500, 1.3),
        // Loot
        cheeseMonsterDropRate: new Upgrade('cheeseBrains', 5, 2, 18),
        cheeseMonsterLoot: new Upgrade('cheeseBrains', 10, 1.15),
        cheeseMonsterSentience: new Upgrade('cheeseBrains', 20, 1.2),
        cheeseMonsterMoldiness: new Upgrade('cheeseBrains', 100, 1.25),
        // Milk Power
        milkPowerGain: new Upgrade('milkPower', 100, 2),
        cheeseMonsterCapacityPerUpgrade: new Upgrade('milkPower', 1000, 1.5),
        // Milk
        milkThoughtsGain: new Upgrade('milk', 10, 1.5),
        milkCheeseGain: new Upgrade('milk', 10, 1.5),
        milkMoldyCheeseGain: new Upgrade('milk', 10, 1.5),
        milkMonsterGain: new Upgrade('milk', 10, 1.5),
    };
    const upgrades = makeStore(upgradesInitial);

    console.log('unlocks.ts');
    var UnlockName;
    (function (UnlockName) {
        // Thoughts
        UnlockName["START"] = "start";
        UnlockName["THINK_PASSIVELY"] = "thinkPassively";
        UnlockName["THINK_FASTER"] = "thinkFaster";
        UnlockName["THOUGHT_BOOST"] = "thoughtBoost";
        UnlockName["THOUGHTS_50_PERCENT"] = "thoughts50Percent";
        UnlockName["SWITZERLAND"] = "switzerland";
        UnlockName["THOUGHT_BOOST_STACK"] = "thoughtBoostStack";
        UnlockName["MOLDY_CHEESE"] = "moldyCheese";
        UnlockName["MILK"] = "milk";
        // Cheese
        UnlockName["CHEESE_QUEUE"] = "cheeseQueue";
        UnlockName["CHEESE_QUEUE_OVERCLOCKING"] = "cheeseQueueOverclocking";
        UnlockName["CHEESE_QUEUE_LENGTH_BOOST"] = "cheeseQueueLengthBoost";
        UnlockName["CHEESE_BOOST"] = "cheeseBoost";
        UnlockName["CHEESE_QUEUE_COST_DIVIDE"] = "cheeseQueueCostDivide";
        UnlockName["CHEESE_CYCLE_ACCELERATOR"] = "cheeseCycleAccelerator";
        UnlockName["THOUGHT_JERK"] = "thoughtJerk";
        UnlockName["CHEESE_MODES"] = "cheeseModes";
        UnlockName["CHEESE_CYCLES_BOOST_THOUGHTS"] = "cheeseCyclesBoostThoughts";
        // Moldy Cheese
        UnlockName["MOLDY_CHEESE_BYPRODUCT"] = "moldyCheeseByproduct";
        UnlockName["CHEESEYARD"] = "cheeseyard";
        UnlockName["MANUAL_MOLDY_CHEESE_CONVERSION_BOOST"] = "manualMoldyCheeseConversionBoost";
        UnlockName["CHEESEYARD_MOLD_UPGRADE"] = "cheeseyardMoldUpgrade";
        UnlockName["MOLDY_CHEESE_CYCLE_DURATION_BOOST"] = "moldyCheeseCycleDurationBoost";
        UnlockName["MOLDY_CHEESE_HALFLIFE_BOOST"] = "moldyCheeseHalflifeBoost";
        // Cheeseyard
        UnlockName["MONSTER_BRAIN_WAVE_CONTROLLER"] = "monsterBrainWaveController";
        UnlockName["CHEESE_MONSTER_MASSACRE"] = "cheeseMonsterMassacre";
        UnlockName["CHEESE_MONSTER_COLLECTIVE_SENTIENCE"] = "cheeseMonsterCollectiveSentience";
        UnlockName["CHEESE_MONSTER_TOTAL_DEATHS_BOOST"] = "cheeseMonsterTotalDeathsBoost";
    })(UnlockName || (UnlockName = {}));
    const unlocks = {
        // Cogito Ergo Sum
        thoughts: [
            {
                name: UnlockName.THINK_PASSIVELY,
                type: 'Boost',
                resource: 'thoughts',
                cost: 10,
                title: 'Learn to think',
                description: 'You think <strong>once</strong> per second.',
                tooltipText: '"I think, therefore I am."',
            },
            {
                name: UnlockName.THINK_FASTER,
                type: 'Unlock',
                resource: 'thoughts',
                cost: 30,
                title: 'Accelerate your thinking',
                description: 'Unlock the upgrade <strong>Thought Acceleration</strong>',
                tooltipText: 'Really makes you think...',
                availableAt: UnlockName.THINK_PASSIVELY,
            },
            {
                name: UnlockName.THOUGHT_BOOST,
                type: 'Mechanic',
                resource: 'thoughts',
                cost: 50,
                title: 'Boost your thinking',
                description: 'Instead of thinking once when you click, you gain a production multiplier temporarily.',
                tooltipText: '"i dont want to spam click a gazillion times to play ur stupid game" <br> <strong>- HentaiEnjoyer1978',
                availableAt: UnlockName.THINK_PASSIVELY,
            },
            {
                name: UnlockName.THOUGHTS_50_PERCENT,
                type: 'Boost',
                resource: 'thoughts',
                cost: 500,
                title: 'Simple Maths',
                description: 'Your thinking is boosted by 50%.',
                tooltipText: '"If you no longer go for a production multiplier that exists, you\'re no longer an incrementalist."',
                availableAt: UnlockName.THINK_PASSIVELY,
            },
            {
                name: UnlockName.SWITZERLAND,
                type: 'Unlock',
                resource: 'thoughts',
                cost: 3000,
                title: 'Travel to Switzerland',
                description: 'You can start producing <strong style="color:yellow">Cheese</strong>.',
                tooltipText: 'The land of cheese',
                availableAt: UnlockName.THINK_PASSIVELY,
            },
            {
                name: UnlockName.THOUGHT_BOOST_STACK,
                type: 'Unlock',
                resource: 'thoughts',
                cost: 1e6,
                title: 'Extended Focus',
                description: 'Gain the ability to stack Thought Boosts.',
                tooltipText: 'Viagra for the brain',
                availableAt: UnlockName.CHEESE_QUEUE,
            },
            {
                name: UnlockName.MOLDY_CHEESE,
                type: 'Unlock',
                resource: 'thoughts',
                cost: 100e9,
                title: 'Derivative Cheese',
                description: 'You can convert <strong style="color:yellow">Cheese</strong> into <strong style="color:rgb(60, 255, 0)">Moldy Cheese</strong>, if you think it tastes better.',
                tooltipText: 'Is it okay to eat?',
                availableAt: UnlockName.CHEESE_QUEUE,
            },
            {
                name: UnlockName.MILK,
                type: 'Unlock',
                resource: 'thoughts',
                cost: 1e22,
                title: 'Prestige?',
                description: '<span>You can reset your progress for a glass of calcium-rich <strong>Milk</strong></span>.',
                tooltipText: 'From cheese you get milk...I think.',
                availableAt: UnlockName.THOUGHT_JERK,
            },
        ],
        // Switzerland Simulator
        cheese: [
            {
                name: UnlockName.CHEESE_QUEUE,
                type: 'Mechanic',
                resource: 'cheese',
                cost: 8,
                title: 'Cheese Queue',
                description: 'You can queue up the production of <strong style="color:yellow">Cheese</strong>.',
                tooltipText: 'Cheese-o-mation lets you cheese clicking a button.',
            },
            {
                name: UnlockName.CHEESE_QUEUE_OVERCLOCKING,
                type: 'Mechanic',
                resource: 'cheese',
                cost: 50,
                title: 'Cheese Overclocking',
                description: 'You can increase the speed of your workers producing cheese by forcing them to think faster.',
                tooltipText: 'Thinking about how to cheese faster...',
            },
            {
                name: UnlockName.CHEESE_QUEUE_LENGTH_BOOST,
                type: 'Effect',
                resource: 'cheese',
                cost: 500,
                title: 'Length Boost',
                description: 'The capacity of the Cheese Queue boosts cheese production.',
                tooltipText: 'Give your employees more work like a good boss.',
                availableAt: UnlockName.CHEESE_QUEUE,
            },
            {
                name: UnlockName.CHEESE_BOOST,
                type: 'Effect',
                resource: 'cheese',
                cost: 50000,
                title: 'Cheese Boost',
                description: 'Thought Boost also affects cheese production.',
                tooltipText: 'If you think hard enough, you can create cheese out of nothing.',
                availableAt: UnlockName.CHEESE_QUEUE,
            },
            {
                name: UnlockName.CHEESE_QUEUE_COST_DIVIDE,
                type: 'Unlock',
                resource: 'cheese',
                cost: 1e6,
                title: 'Cheepse',
                description: 'Unlock an additional upgrade to make cheese production more cost-efficient.',
                tooltipText: 'How much does a thought weigh?',
                availableAt: UnlockName.CHEESE_QUEUE,
            },
            {
                name: UnlockName.CHEESE_CYCLE_ACCELERATOR,
                type: 'Effect',
                resource: 'cheese',
                cost: 5e6,
                title: 'Experience is key',
                description: 'Cheese production speeds up based on the amount of cheese cycles completed.',
                tooltipText: 'The mastery of cheese, a very important life skill to have.',
                availableAt: UnlockName.CHEESE_QUEUE_LENGTH_BOOST,
            },
            {
                name: UnlockName.THOUGHT_JERK,
                type: 'Unlock',
                resource: 'cheese',
                cost: 3e7,
                title: 'More to think about',
                description: 'Jerk(?) your thinking.',
                tooltipText: 'something something per second cubed',
                availableAt: UnlockName.CHEESE_QUEUE_LENGTH_BOOST,
            },
            {
                name: UnlockName.CHEESE_MODES,
                type: 'Mechanic',
                resource: 'cheese',
                cost: 5e7,
                title: 'Cheese Factory Protocol',
                description: 'Gain access to 3 modes to help manage your cheese production',
                tooltipText: 'Micromanaging your employees will lead to universal happiness.',
                availableAt: UnlockName.CHEESE_QUEUE_LENGTH_BOOST,
            },
            {
                name: UnlockName.CHEESE_CYCLES_BOOST_THOUGHTS,
                type: 'Effect',
                resource: 'cheese',
                cost: 1e8,
                title: 'Return on Investment',
                description: 'Total cheese cycles give a boost (multiplier) to your thinking.',
                tooltipText: 'I like cycling. My favorite is cheese.',
                availableAt: UnlockName.CHEESE_CYCLE_ACCELERATOR,
            },
        ],
        // Moldy Cheese
        moldyCheese: [
            {
                name: UnlockName.MOLDY_CHEESE_BYPRODUCT,
                type: 'Mechanic',
                resource: 'moldyCheese',
                cost: 100,
                title: 'Moldomation',
                description: 'Sometimes the cheese factory will produce moldy cheese as a byproduct.',
                tooltipText: 'Is this good... or bad?',
            },
            {
                name: UnlockName.CHEESEYARD,
                type: 'Unlock',
                resource: 'moldyCheese',
                cost: 2000,
                title: 'End Times',
                description: 'Construct the <strong style="color:crimson">Cheeseyard</strong>, a place where abominations made of cheese reside.',
                tooltipText: 'What happens after cheese dies?',
            },
            {
                name: UnlockName.MANUAL_MOLDY_CHEESE_CONVERSION_BOOST,
                type: 'Boost',
                resource: 'moldyCheese',
                cost: 4000,
                title: 'Passiveness',
                description: 'Cheese sacrifice produces 10x more moldy cheese, but its cooldown is also increased by 10x.',
                tooltipText: 'Some scientists are still unsure whether this will increase your effective gain.',
            },
            {
                name: UnlockName.CHEESEYARD_MOLD_UPGRADE,
                type: 'Unlock',
                resource: 'moldyCheese',
                cost: 8000,
                title: 'Em(b)olden',
                description: 'Your cheese monsters can get moldy. <br> Unlock an additional upgrade in the Cheeseyard.',
                tooltipText: 'This smells...',
                availableAt: UnlockName.MONSTER_BRAIN_WAVE_CONTROLLER,
            },
            {
                name: UnlockName.MOLDY_CHEESE_CYCLE_DURATION_BOOST,
                type: 'Effect',
                resource: 'moldyCheese',
                cost: 16000,
                title: 'Slow and Steady',
                description: 'Moldy cheese byproduct gain is boosted by the relative duration of the cheese cycle (which depends on the cheese factory protocol).',
                tooltipText: 'The most meticulously crafted cheese is the moldiest.',
                availableAt: UnlockName.MONSTER_BRAIN_WAVE_CONTROLLER,
            },
            {
                name: UnlockName.MOLDY_CHEESE_HALFLIFE_BOOST,
                type: 'Effect',
                resource: 'moldyCheese',
                cost: 1e6,
                title: 'Half-important Upgrade',
                description: 'Cheese gain is additionally boosted by MC half-life.',
                tooltipText: 'How much are 2 half-lives? They drop your braincells by 75%.',
                availableAt: UnlockName.CHEESEYARD_MOLD_UPGRADE,
            },
        ],
        // The Cheeseyard
        cheeseBrains: [
            {
                name: UnlockName.CHEESE_MONSTER_MASSACRE,
                type: 'Mechanic',
                resource: 'cheeseBrains',
                cost: 200,
                title: 'No Morals',
                description: 'When killing many cheese monsters at once, the loot is massively boosted.',
                tooltipText: 'Rewarding genocide! <br /> (only applies in this game and NOT in real life)',
            },
            {
                name: UnlockName.CHEESE_MONSTER_COLLECTIVE_SENTIENCE,
                type: 'Mechanic',
                resource: 'cheeseBrains',
                cost: 1e5,
                title: 'Collective Sentience',
                description: 'Bigger populations give a (much) bigger global boost to thinking due to emergence.',
                tooltipText: 'Completely harmless.',
            },
            {
                name: UnlockName.CHEESE_MONSTER_TOTAL_DEATHS_BOOST,
                type: 'Effect',
                resource: 'cheeseBrains',
                cost: 1e6,
                title: 'Mass Murder',
                description: 'Total cheese monster deaths boost dropped monster loot.',
                tooltipText: 'You have to perfect to art of killing to extract the most out of corpses.',
            },
        ],
    };
    const unlocked = makeStore(convertEnumToFlagObject(UnlockName));
    /* export const unlocked = makeStore<Record<UnlockName, boolean>>({
      start: true,

      // Cogito Ergo Sum
      thinkPassively: false,
      thinkFaster: false,
      thoughtBoost: false,
      thoughts50Percent: false,
      switzerland: false,
      thoughtBoostStack: false,
      moldyCheese: false,
      milk: false,

      // Switzerland Simulator
      cheeseQueue: false,
      cheeseQueueLengthBoost: false,
      cheeseBoost: false,
      cheeseCycleAccelerator: false,
      thoughtJerk: false,
      cheeseModes: false,
      cheeseCyclesBoostThoughts: false,

      // Moldy Cheese
      moldyCheeseByproduct: false,
      manualMoldyCheeseConversionBoost: false,
      cheeseyard: false,
      moldyCheeseCycleDurationBoost: false,

      // The Cheeseyard
      monsterBrainWaveController: false,
      cheeseMonsterMassacre: false,
      cheeseMonsterCollectiveSentience: false,
      cheeseMonsterTotalDeathsBoost: false,

      // Milk
    }) */
    function convertEnumToFlagObject(enumme) {
        const obj = Object.values(enumme);
        const result = {};
        obj.forEach(value => {
            if (value === enumme.START)
                result[value] = true;
            else
                result[value] = false;
        });
        return result;
    }
    // console.log('ENUM ', Object.values(UnlockName), convertEnumToUnlockedObject(UnlockName))

    var MilkBoost;
    (function (MilkBoost) {
        MilkBoost["ThoughtAccelBoostsItself"] = "thoughtAccelBoostsItself";
        MilkBoost["ImproveFormulaCheeseBoostsThoughts"] = "improveFormulaCheeseBoostsThoughts";
        MilkBoost["ImproveFormulaCheeseQueueLengthBoostsCheese"] = "improveFormulaCheeseQueueLengthBoostsCheese";
        MilkBoost["ImproveFormulaTotalCheeseCyclesBoostsThoughts"] = "improveFormulaTotalCheeseCyclesBoostsThoughts";
        MilkBoost["UnlockAdditionalUpgradesCheeseProductionTime"] = "unlockAdditionalUpgradesCheeseProductionTime";
        MilkBoost["MCByproductBoostedByMCHalflife"] = "mCByproductBoostedByMCHalflife";
        MilkBoost["CheeseCyclesPerCheeseModeBoostCheese"] = "cheeseCyclesPerCheeseModeBoostCheese";
        MilkBoost["CheeseUpgradeProductionTimeGivesFreeCheeseUpgradeYield"] = "cheeseUpgradeProductionTimeGivesFreeCheeseUpgradeYield";
        MilkBoost["ThoughtGainBoostedByThoughts"] = "thoughtGainBoostedByThoughts";
        MilkBoost["MilkGainMultiplied"] = "milkGainMultiplied";
        MilkBoost["UnspentMilkBoostsCheese"] = "unspentMilkBoostsCheese";
        MilkBoost["GainPercentageOfPotentialMilk"] = "gainPercentageOfPotentialMilk";
        MilkBoost["MassacreEffectBoosted"] = "massacreEffectBoosted";
        MilkBoost["CollectiveSentienceBoosted"] = "collectiveSentienceBoosted";
        MilkBoost["BetterScalingTotalCheeseMonsterDeathsLootBoost"] = "betterScalingTotalCheeseMonsterDeathsLootBoost";
        MilkBoost["UnspentCheeseBrainsBoostMonsterResourceGeneration"] = "unspentCheeseBrainsBoostMonsterResourceGeneration";
    })(MilkBoost || (MilkBoost = {}));
    const milkBoostActive = makeStore({
        thoughtAccelBoostsItself: false,
        improveFormulaCheeseBoostsThoughts: false,
        improveFormulaCheeseQueueLengthBoostsCheese: false,
        improveFormulaTotalCheeseCyclesBoostsThoughts: false,
        unlockAdditionalUpgradesCheeseProductionTime: false,
        mCByproductBoostedByMCHalflife: false,
        cheeseCyclesPerCheeseModeBoostCheese: false,
        cheeseUpgradeProductionTimeGivesFreeCheeseUpgradeYield: false,
        thoughtGainBoostedByThoughts: false,
        milkGainMultiplied: false,
        unspentMilkBoostsCheese: false,
        gainPercentageOfPotentialMilk: false,
        massacreEffectBoosted: false,
        collectiveSentienceBoosted: false,
        betterScalingTotalCheeseMonsterDeathsLootBoost: false,
        unspentCheeseBrainsBoostMonsterResourceGeneration: false,
    });
    const milkBoosts = {
        [MilkBoost.ThoughtAccelBoostsItself]: {
            label: 'Reacceleration',
            description: 'The effect of Thought Acceleration is multiplied by a factor proportional to the ' +
                'amount of Thought Acceleration upgrades you own.',
            cost: 5,
            activated: false,
            available: false,
        },
        [MilkBoost.ImproveFormulaCheeseBoostsThoughts]: {
            label: 'Cheesy Thoughts',
            description: 'Improve the formula for cheese increasing thoughts/s <br> Current Formula: log(cheese + 1) <br>' +
                'Improved Formula: sqrt(cheese)',
            cost: 10,
            activated: false,
            available: false,
        },
        [MilkBoost.ImproveFormulaCheeseQueueLengthBoostsCheese]: {
            label: 'Polynomial Queue',
            description: 'Improves the formula for Cheese Queue Length affecting cheese production. <br>' +
                'Current Formula: MaxLength / 10 <br> Improved Formula: MaxLength^3 / 100',
            cost: 5,
            activated: false,
            available: false,
        },
        [MilkBoost.ImproveFormulaTotalCheeseCyclesBoostsThoughts]: {
            label: 'Braincycles',
            description: 'Improves the Formula for Total Cheese Cycles boosting your thinking <br>' +
                'Current Formula: sqrt(cycles / 10) <br> Improved Formula: cycles^2 / 1000 ',
            cost: 15,
            activated: false,
            available: false,
        },
        [MilkBoost.UnlockAdditionalUpgradesCheeseProductionTime]: {
            label: 'Crunch Time',
            description: 'Unlock 50 additional upgrades for “cheese production 5% takes less time...”',
            cost: 15,
            activated: false,
            available: false,
        },
        [MilkBoost.MCByproductBoostedByMCHalflife]: {
            label: 'Moldy Time',
            description: 'The relative duration of the meticulous cheese factory protocol is multiplied by 100. <br>' +
                'MC byproduct yield is additionally boosted by MC half-life (in seconds). <br> Factor: (half-life / 100)^3',
            cost: 25,
            activated: false,
            available: false,
        },
        [MilkBoost.CheeseCyclesPerCheeseModeBoostCheese]: {
            label: 'Diverse Factory',
            description: 'Cheese Cycles completed for each cheese factory protocol give a boost to cheese production. ' +
                'Each mode contributes to a separate factor, and cheese gain is multiplied by all 3 factors. <br>' +
                '(If this boost is deactivated, these factors are saved at their current values.)',
            cost: 20,
            activated: false,
            available: false,
        },
        [MilkBoost.CheeseUpgradeProductionTimeGivesFreeCheeseUpgradeYield]: {
            label: 'Overproduction',
            description: 'When increasing the workload of your cheese factory workers, they complete their work in the same amount of time. <br>' +
                '(Their families are being threatened, they know what happens if they dont comply.)',
            cost: 10,
            activated: false,
            available: false,
        },
        [MilkBoost.ThoughtGainBoostedByThoughts]: {
            label: 'Thoughtback Loop',
            description: 'Thoughts/s are boosted by total thoughts. <br> Relationship: thoughts/s *= sqrt(thoughts)',
            cost: 20,
            activated: false,
            available: false,
        },
        [MilkBoost.MilkGainMultiplied]: {
            label: 'Milkiplied',
            description: 'Milk gain is tripled.',
            cost: 5,
            activated: false,
            available: false,
        },
        [MilkBoost.UnspentMilkBoostsCheese]: {
            label: 'Milky Cheese',
            description: 'Your unspent milk increases cheese gain proportionally. <br> (cheeseGain *= milk / 10)',
            cost: 15,
            activated: false,
            available: false,
        },
        [MilkBoost.MassacreEffectBoosted]: {
            label: 'Genocidal Tendencies',
            description: 'The Massacre effect for cheese monsters is more potent. <br> Exponent: 1.3 -> 2.0',
            cost: 15,
            activated: false,
            available: false,
        },
        [MilkBoost.CollectiveSentienceBoosted]: {
            label: 'Der Schwarm',
            description: 'The collective sentience of cheese monsters is boosted. (use at your own risk) <br> ' + 'Exponent: 3.0 -> 5.0',
            cost: 20,
            activated: false,
            available: false,
        },
        [MilkBoost.BetterScalingTotalCheeseMonsterDeathsLootBoost]: {
            label: 'Death Scaling',
            description: 'Better scaling for Upgrade “Total cheese monster deaths boost loot gain” <br>' +
                'Scaling: quadratic -> cubic(?)',
            cost: 25,
            activated: false,
            available: false,
        },
        [MilkBoost.UnspentCheeseBrainsBoostMonsterResourceGeneration]: {
            label: 'Brain Scaling',
            description: 'The cheese monster resource generation is boosted based on unspent cheese brains <br>' +
                'Factor: cheeseBrains^1.5',
            cost: 25,
            activated: false,
            available: false,
        },
        [MilkBoost.GainPercentageOfPotentialMilk]: {
            label: '',
            description: '',
            cost: 0,
            activated: false,
            available: false,
        },
    };
    const skillTree = [
        [
            milkBoosts.thoughtAccelBoostsItself,
            milkBoosts.improveFormulaCheeseQueueLengthBoostsCheese,
            milkBoosts.milkGainMultiplied,
        ],
        [milkBoosts.improveFormulaCheeseBoostsThoughts, milkBoosts.cheeseUpgradeProductionTimeGivesFreeCheeseUpgradeYield],
        [
            milkBoosts.improveFormulaTotalCheeseCyclesBoostsThoughts,
            milkBoosts.massacreEffectBoosted,
            milkBoosts.unspentMilkBoostsCheese,
            milkBoosts.unlockAdditionalUpgradesCheeseProductionTime,
        ],
        [
            milkBoosts.cheeseCyclesPerCheeseModeBoostCheese,
            milkBoosts.thoughtGainBoostedByThoughts,
            milkBoosts.collectiveSentienceBoosted,
        ],
        [
            milkBoosts.mCByproductBoostedByMCHalflife,
            milkBoosts.betterScalingTotalCheeseMonsterDeathsLootBoost,
            milkBoosts.unspentCheeseBrainsBoostMonsterResourceGeneration,
        ],
    ];
    const allowedSkillTreeConnections = [
        '000',
        '010',
        '011',
        '021',
        '100',
        '101',
        '112',
        '113',
        '210',
        '211',
        '221',
        '222',
        '300',
        '311',
        '322',
    ];

    const ADMIN_MODE = makeStore(false);
    const LORCA_OVERRIDE = makeStore(false);
    const devToolsEnabled = makeStore(false);
    const lastSaved = makeStore(Date.now());
    const totalTimePlayed = makeStore(0);
    const currentThoughtBoost = makeStore(1);
    const currentThoughtBoostTime = makeStore(0);
    const currentCheeseQueue = makeStore(0);
    const cheeseQueueActive = makeStore(false);
    const cheeseQueueOverclockLvl = makeStore(0);
    const cheeseQueueTotalCycles = makeStore(0);
    const cheeseFactoryMode = makeStore('nominal');
    const totalCheeseMonsterDeaths = makeStore(0);
    const brainMode = makeStore('peaceful');
    const highestMilk = makeStore(0);

    var store = /*#__PURE__*/Object.freeze({
        __proto__: null,
        resource: resource,
        upgrades: upgrades,
        unlocked: unlocked,
        milkBoostActive: milkBoostActive,
        ADMIN_MODE: ADMIN_MODE,
        LORCA_OVERRIDE: LORCA_OVERRIDE,
        devToolsEnabled: devToolsEnabled,
        lastSaved: lastSaved,
        totalTimePlayed: totalTimePlayed,
        currentThoughtBoost: currentThoughtBoost,
        currentThoughtBoostTime: currentThoughtBoostTime,
        currentCheeseQueue: currentCheeseQueue,
        cheeseQueueActive: cheeseQueueActive,
        cheeseQueueOverclockLvl: cheeseQueueOverclockLvl,
        cheeseQueueTotalCycles: cheeseQueueTotalCycles,
        cheeseFactoryMode: cheeseFactoryMode,
        totalCheeseMonsterDeaths: totalCheeseMonsterDeaths,
        brainMode: brainMode,
        highestMilk: highestMilk
    });

    const upgradesTieredInitial = {};
    makeUpgradesStore(upgradesTieredInitial);
    function makeUpgradesStore(initialState) {
        const store = makeStore(initialState);
        const buy = (name) => {
            store.update($store => {
                const upgrade = $store[name];
                let checkoutCost = 0;
                const res = get_store_value(resource)[upgrade.resource];
                if (res < upgrade.cost)
                    return $store;
                checkoutCost = upgrade.cost;
                upgrade.cost *= upgrade.costMultiplier;
                upgrade.bought++;
                upgrade.totalEffectMultiplier *= upgrade.effectMultiplierInTier[upgrade.tier - 1];
                const toNextTier = upgrade.upgradesToNextTier[upgrade.tier - 1];
                if (toNextTier !== undefined && upgrade.bought >= toNextTier) {
                    upgrade.tier++;
                    upgrade.bought = 0;
                    // divide thru costMultiplier so it cancels out
                    upgrade.cost *= upgrade.tierUpMultipler / upgrade.costMultiplier;
                    upgrade.totalEffectMultiplier *= 10;
                }
                resource.update($resource => {
                    $resource[upgrade.resource] -= checkoutCost;
                    return $resource;
                });
                return $store;
            });
        };
        return Object.assign(Object.assign({}, store), { buy });
    }

    console.log('primitive.ts');

    const thoughtBoostMax = derived(upgrades, $upgrades => 1.5 + 0.2 * Math.pow($upgrades.thoughtBoostStrength.bought, 1.5));
    const thoughtBoostDuration = derived(upgrades, $upgrades => 5000 + 5000 * $upgrades.thoughtBoostDuration.bought);
    const thoughtBoostMaxStacks = derived(upgrades, $upgrades => 1 + $upgrades.thoughtBoostStack.bought);
    const thoughtsPerSecBase = derived([unlocked, upgrades], ([$unlocked, $upgrades]) => {
        const fromBasicUpgrades = $upgrades.thoughtAcceleration.bought * (1 * $upgrades.thoughtJerk.bought + 1);
        return +$unlocked.thinkPassively + fromBasicUpgrades;
    });
    const thoughtMultFromUnlocks = derived(unlocked, $unlocked => checkBoolForNum($unlocked.thoughts50Percent, 1.5));
    const cheeseThoughtMult = derived([resource, upgrades], ([$resource, $upgrades]) => 1 + Math.log($resource.cheese + 1) * $upgrades.cheeseThoughtMult.bought * $upgrades.cheeseThoughtMult.bought);
    const maxCheeseQueue = derived(upgrades, $upgrades => 5 + 5 * $upgrades.cheeseQueueLength.bought);
    const cheeseCyclesThoughtMult = derived([unlocked, cheeseQueueTotalCycles], ([$unlocked, $cheeseQueueTotalCycles]) => checkBoolForNum($unlocked.cheeseCyclesBoostThoughts, 1 + 0.001 * Math.pow($cheeseQueueTotalCycles, 1.5)));
    const cheeseYieldDeltaDuration = 500; // ms
    const cheeseModeStats = {
        meticulous: { yield: 1, duration: 10, cost: 1 },
        nominal: { yield: 1, duration: 1, cost: 1 },
        warpSpeed: { yield: 1 / 100, duration: 1 / 10, cost: 1 / 10 },
    };
    const cheeseModeFactor = derived(cheeseFactoryMode, $cheeseFactoryMode => cheeseModeStats[$cheeseFactoryMode]);
    const cheeseQueueCostDivideBy = derived(upgrades, $upgrades => $upgrades.cheeseQueueOverclockingCost.bought > 0
        ? 1 + 0.25 * ($upgrades.cheeseQueueOverclockingCost.bought + 1) * ($upgrades.cheeseQueueOverclockingCost.bought + 1)
        : 1);
    const cheeseQueueOverclockSpeedMult = derived(cheeseQueueOverclockLvl, $cheeseQueueOverclockLvl => Math.pow(1.05, $cheeseQueueOverclockLvl));
    const cheeseQueueOverclockCostMult = derived(cheeseQueueOverclockLvl, $cheeseQueueOverclockLvl => 1 * Math.pow(2, $cheeseQueueOverclockLvl));
    const cheeseCycleAcceleratorFactor = derived([unlocked, cheeseQueueTotalCycles], ([$unlocked, $cheeseQueueTotalCycles]) => checkBoolForNum($unlocked.cheeseCycleAccelerator, 1 + Math.log($cheeseQueueTotalCycles / 100 + 1)));
    const cheeseBoostFactorYield = derived([unlocked, currentThoughtBoost], ([$unlocked, $currentThoughtBoost]) => checkBoolForNum($unlocked.cheeseBoost, $currentThoughtBoost));
    // MOLDY STUFF
    const mcHalfLifeStartingValue = 10;
    const mcHalfLifeSeconds = derived(upgrades, $upgrades => mcHalfLifeStartingValue + 10 * $upgrades.moldyCheeseHalfLife.bought);
    const moldyCheeseChance = derived(upgrades, $upgrades => 0.1 + 0.1 * $upgrades.moldyCheeseChance.bought);
    const mcConversionCooldownMS = derived(unlocked, $unlocked => $unlocked.manualMoldyCheeseConversionBoost ? 5000 * 10 : 5000);
    // softcap upgrade when exponent > 1? (currently at >323 bought)
    const mcConversionExponent = derived(upgrades, $upgrades => 0.1 + 0.05 * Math.sqrt($upgrades.moldyCheeseConversionExponent.bought + 1));
    // CHEESEYARD STUFF
    const cheeseMonsterBrainModeResourceFactors = {
        peaceful: 1,
        neutral: 0.2,
        destructive: 0,
    };
    const resourceFactorFromBrainMode = derived(brainMode, $brainMode => cheeseMonsterBrainModeResourceFactors[$brainMode]);
    const cheeseMonsterCapacityPerUpgrade = derived(upgrades, $upgrades => $upgrades.cheeseMonsterCapacityPerUpgrade.bought > 0
        ? 0.1 * Math.pow($upgrades.cheeseMonsterCapacityPerUpgrade.bought + 10, 2)
        : 10);
    /** per second */
    const cheeseMonsterSpawnrate = derived([unlocked, upgrades], ([$unlocked, $upgrades]) => (+$unlocked.cheeseyard * $upgrades.cheeseMonsterSpawnrate.bought) / 3);
    const cheeseMonsterDeathRateStats = {
        peaceful: 0,
        neutral: 0.01,
        destructive: 0.1,
    };
    const cheeseMonsterDeathrate = derived(brainMode, $brainMode => cheeseMonsterDeathRateStats[$brainMode]);
    const cheeseMonsterDropRate = derived(upgrades, $upgrades => 0.1 + 0.05 * $upgrades.cheeseMonsterDropRate.bought);
    const totalMonsterDeathsLootBoost = derived([unlocked, totalCheeseMonsterDeaths], ([$unlocked, $totalDeaths]) => $unlocked.cheeseMonsterTotalDeathsBoost ? 1 + 1e-6 * Math.pow($totalDeaths, 2) : 1);
    const cheeseMonsterCollectiveSentienceMultiplier = derived([resource, unlocked], ([$resource, $unlocked]) => $unlocked.cheeseMonsterCollectiveSentience ? 1 + 1e-6 * Math.pow($resource.cheeseMonster, 3) : 1);
    // how much each monster boosts thoughts/s (additive per monster)
    const monsterThoughtFactor = derived(upgrades, $upgrades => 1 + 1 * $upgrades.cheeseMonsterSentience.bought);
    const monsterMoldyCheeseFactor = derived(upgrades, $upgrades => 0.01 * $upgrades.cheeseMonsterMoldiness.bought);

    const baseCost = 10;
    const cheeseCycleBase = {
        duration: derived(upgrades, $upgrades => 1000 + cheeseYieldDeltaDuration * $upgrades.cheeseYield.bought),
        yield: derived(upgrades, $upgrades => 1 + 0.5 * ($upgrades.cheeseYield.bought + $upgrades.cheeseYield.bought * $upgrades.cheeseYield.bought)),
        cost: derived([cheeseQueueOverclockCostMult, cheeseQueueCostDivideBy], ([$cheeseQueueOverclockCostMult, $cheeseQueueCostDivideBy]) => {
            return (baseCost * $cheeseQueueOverclockCostMult) / $cheeseQueueCostDivideBy;
        }),
    };
    const cheeseQueueLengthBoostFactor = derived([unlocked, maxCheeseQueue], ([$unlocked, $maxCheeseQueue]) => checkBoolForNum($unlocked.cheeseQueueLengthBoost, ($maxCheeseQueue * $maxCheeseQueue) / 100));
    const mcHalflifeBoostFactor = derived([mcHalfLifeSeconds, unlocked], ([$mcHalfLifeSeconds, $unlocked]) => $unlocked.moldyCheeseHalflifeBoost ? 1 + 1e-6 * Math.pow($mcHalfLifeSeconds, 3) : 1);
    /* Reactive variables for Yield, Duration & Cost of the cheese cycle */
    const cheeseCycleBatchSize = derived([
        cheeseCycleBase.yield,
        cheeseQueueLengthBoostFactor,
        cheeseBoostFactorYield,
        cheeseModeFactor,
        mcHalflifeBoostFactor,
    ], ([$cheeseCycleBaseYield, $cheeseQueueLengthBoostFactor, $cheeseBoostFactorYield, $cheeseModeFactor, $mcHalflifeBoostFactor,]) => $cheeseCycleBaseYield *
        $cheeseQueueLengthBoostFactor *
        $cheeseBoostFactorYield *
        $cheeseModeFactor.yield *
        $mcHalflifeBoostFactor);
    const cheeseCycleDuration = derived([cheeseCycleBase.duration, cheeseQueueOverclockSpeedMult, cheeseModeFactor, cheeseCycleAcceleratorFactor], ([$cheeseCycleBaseDuration, $cheeseQueueOverclockSpeedMult, $cheeseModeFactor, $cheeseCycleAcceleratorFactor]) => $cheeseCycleBaseDuration *
        (1 / $cheeseQueueOverclockSpeedMult) *
        $cheeseModeFactor.duration *
        (1 / $cheeseCycleAcceleratorFactor));
    const cheeseCycleCost = derived([cheeseCycleBase.cost, cheeseModeFactor], ([$cheeseCycleBaseCost, $cheeseModeFactor]) => $cheeseCycleBaseCost * $cheeseModeFactor.cost);
    const mcCycleDurationBoostFactor = derived(cheeseModeFactor, $cheeseModeFactor => Math.pow($cheeseModeFactor.duration, 1.5));
    const cheeseMonsterCapacity = derived([upgrades, cheeseMonsterCapacityPerUpgrade], ([$upgrades, $cheeseMonsterCapacityPerUpgrade]) => $cheeseMonsterCapacityPerUpgrade * (1 + $upgrades.cheeseMonsterCapacity.bought));
    const cheeseMonsterDeathsPerSec = derived([cheeseMonsterDeathrate, resource], ([$cheeseMonsterDeathrate, $resource]) => $cheeseMonsterDeathrate * $resource.cheeseMonster);
    const cheeseMonsterMassacreMultiplier = derived([unlocked, cheeseMonsterDeathsPerSec], ([$unlocked, $cheeseMonsterDeathsPerSec]) => $unlocked.cheeseMonsterMassacre ? 1 + Math.pow($cheeseMonsterDeathsPerSec, 1.3) : 1);
    const cheeseMonsterLootAmount = derived([upgrades, cheeseMonsterMassacreMultiplier], ([$upgrades, $cheeseMonsterMassacreMultiplier]) => (1 + $upgrades.cheeseMonsterLoot.bought) * $cheeseMonsterMassacreMultiplier);
    const approxCheeseBrainsPerSec = derived([cheeseMonsterDeathsPerSec, cheeseMonsterDropRate, cheeseMonsterLootAmount, totalMonsterDeathsLootBoost], ([$cheeseMonsterDeathsPerSec, $cheeseMonsterDropRate, $cheeseMonsterLootAmount, $totalMonsterDeathsLootBoost]) => $cheeseMonsterDeathsPerSec * $cheeseMonsterDropRate * $cheeseMonsterLootAmount * $totalMonsterDeathsLootBoost);
    const monsterThoughtMult = derived([monsterThoughtFactor, resource, resourceFactorFromBrainMode, cheeseMonsterCollectiveSentienceMultiplier], ([$monsterThoughtFactor, $resource, $resourceFactorFromBrainMode, $cheeseMonsterCollectiveSentienceMultiplier]) => 1 +
        $monsterThoughtFactor *
            $cheeseMonsterCollectiveSentienceMultiplier *
            $resource.cheeseMonster *
            $resourceFactorFromBrainMode);
    const monsterMoldyCheeseMult = derived([monsterMoldyCheeseFactor, resource, resourceFactorFromBrainMode], ([$monsterMoldyCheeseFactor, $resource, $resourceFactorFromBrainMode]) => 1 + $monsterMoldyCheeseFactor * $resource.cheeseMonster * $resourceFactorFromBrainMode);
    const mcByproductAmount = derived([
        unlocked,
        mcConversionExponent,
        monsterMoldyCheeseMult,
        cheeseFactoryMode,
        cheeseCycleBatchSize,
        mcCycleDurationBoostFactor,
    ], ([$unlocked, $mcConversionExponent, $monsterMoldyCheeseMult, $cheeseFactoryMode, $cheeseCycleBatchSize, $mcCycleDurationBoostFactor,]) => $cheeseFactoryMode !== 'warpSpeed'
        ? Math.pow($cheeseCycleBatchSize, $mcConversionExponent) *
            $monsterMoldyCheeseMult *
            ($unlocked.moldyCheeseCycleDurationBoost ? $mcCycleDurationBoostFactor : 1)
        : 0);
    const mcManualConversionAmount = derived([resource, unlocked, mcConversionExponent, monsterMoldyCheeseMult], ([$resource, $unlocked, $mcConversionExponent, $monsterMoldyCheeseMult]) => Math.pow($resource.cheese, $mcConversionExponent) *
        $monsterMoldyCheeseMult *
        ($unlocked.manualMoldyCheeseConversionBoost ? 10 : 1));
    const thoughtsPerSec = derived([
        thoughtsPerSecBase,
        thoughtMultFromUnlocks,
        currentThoughtBoost,
        cheeseThoughtMult,
        cheeseCyclesThoughtMult,
        monsterThoughtMult,
    ], $factors => $factors.reduce((prev, curr) => prev * curr, 1));

    const milkFromReset = derived(resource, $resource => 1e-5 * Math.pow($resource.thoughts, 0.25) * 1e-3 * Math.pow($resource.cheese, 0.5));
    const milkPowerPerSec = derived(highestMilk, $highestMilk => 1 * Math.pow($highestMilk, 2));
    const upgradesToNextTier = [10, 10, 10, 10];
    const cummulativeUpgradesToTier = [
        upgradesToNextTier[0],
        upgradesToNextTier[0] + upgradesToNextTier[1],
        upgradesToNextTier[0] + upgradesToNextTier[1] + upgradesToNextTier[2],
        upgradesToNextTier[0] + upgradesToNextTier[1] + upgradesToNextTier[2] + upgradesToNextTier[3],
    ];
    const milkUpgradeTier = derived(upgrades, $upgrades => {
        console.log('milkUpgradeTier');
        const result = [];
        let i = 0;
        for (const upgradeBought of [
            $upgrades.milkThoughtsGain.bought,
            $upgrades.milkCheeseGain.bought,
            $upgrades.milkMoldyCheeseGain.bought,
            $upgrades.milkMonsterGain.bought,
        ]) {
            if (upgradeBought >= cummulativeUpgradesToTier[3])
                result[i] = 5;
            else if (upgradeBought >= cummulativeUpgradesToTier[2])
                result[i] = 4;
            else if (upgradeBought >= cummulativeUpgradesToTier[1])
                result[i] = 3;
            else if (upgradeBought >= cummulativeUpgradesToTier[0])
                result[i] = 2;
            else
                result[i] = 1;
            i++;
        }
        return result;
    });
    const milkUpgradeEffectFactor = [2, 1.4, 1.2, 0.5];
    const milkUpgradeEffect = derived([milkUpgradeTier, upgrades], ([$milkUpgradeTier, $upgrades]) => {
        const result = [];
        for (const [upgradeBought, i] of [
            $upgrades.milkThoughtsGain.bought,
            $upgrades.milkCheeseGain.bought,
            $upgrades.milkMoldyCheeseGain.bought,
            $upgrades.milkMonsterGain.bought,
        ].entries()) {
            if (i < 3) {
                result[i] = Math.pow(milkUpgradeEffectFactor[i], upgradeBought);
                result[i] *= Math.pow(5, $milkUpgradeTier[i] - 1);
            }
            else {
                result[i] = milkUpgradeEffectFactor[i] * upgradeBought;
                result[i] *= Math.pow(2, $milkUpgradeTier[i] - 1);
            }
        }
        return result;
    });

    // import {compress, decompress} from 'lz-string'
    console.log('savedload.ts');
    const CURRENT_SAVE_VERSION = '0.0.1';
    /**
     * This is the key the save data will be stored under inside localstorage
     */
    const storageName = 'cogitoErgoSum';
    /**
     * This class holds any data that needs to be saved when the player saves their game.
     * It should only be used for values that must be saved. Anything transient should go directly on the GameModel.
     */
    class SaveData {
        updateFromStores() {
            for (const key in store)
                this.data[key] = get_store_value(store[key]);
        }
        constructor() {
            this.version = CURRENT_SAVE_VERSION;
            this.data = {}; // ALL STORE-RELATED DATA
            this.updateFromStores();
        }
    }
    /**
     * Load the save data from localstorage.
     * If no data is found just return a new SaveData with default values.
     */
    function loadSaveGame() {
        // using a try/catch in case this fails for some reason
        try {
            // see if data exists first
            if (localStorage.getItem(storageName) !== null) {
                // get data from localstorage, decompress it using lz-string, then parse it back into a javascript object
                const saveDataFromLocalStorage = JSON.parse(localStorage.getItem(storageName));
                // sendMessage("Savefile loaded.")
                console.log('saveData loaded:');
                console.log(saveDataFromLocalStorage);
                // migrate the data so we know it is good to use
                dataMigrate(saveDataFromLocalStorage);
                hydrateStores(saveDataFromLocalStorage);
                // update the saveData object with the freshly hydrated stores
                // saveData.updateFromStores()
                // update all the other data that is not from stores
                // saveData.updateFromLocalStorage(saveDataFromLocalStorage)
            }
            else {
                console.log('No save found, created new one.');
            }
        }
        catch (error) {
            console.error(error); // log the error so at least we can see it
        }
    }
    /**
     * Loads the data from localStorage into the stores.
     */
    function hydrateStores(fromStorage) {
        for (const key in store) {
            if (fromStorage.data[key] !== undefined)
                store[key].set(fromStorage.data[key]);
        }
        console.log('Stores hydrated.');
    }
    /**
     * Saves the data to localstorage
     * @param saveData SaveData
     */
    function saveSaveGame() {
        if (saveData !== null) {
            lastSaved.set(Date.now());
            // update the saveData object with all the current values of all the necessary stores
            saveData.updateFromStores();
            try {
                // Use JSON.stringify to turn the object into a string, then compress with lz-string,
                // before setting it in localstorage
                localStorage.setItem(storageName, JSON.stringify(saveData));
                console.log('saveData saved:');
                console.log(saveData);
            }
            catch (error) {
                console.error(error); // log the error so at least we can see it
            }
        }
    }
    function exportSaveGame() {
        if (saveData !== null) {
            saveData.updateFromStores();
            return JSON.stringify(saveData);
        }
        return 'Error: saveData is null.';
    }
    function importSaveGame(data) {
        try {
            const importedSaveData = JSON.parse(data);
            dataMigrate(importedSaveData);
            hydrateStores(importedSaveData);
        }
        catch (error) {
            console.error(error);
        }
    }
    /**
     * This function will help to update any data that was saved before new variables were added.
     * Otherwise this can cause errors when something you expected to be there is not there.
     */
    function dataMigrate(fromStorage) {
        console.log('Migrating saveData...');
        // create a new saveData to use as a reference
        const master = new SaveData();
        console.log('fromStorage', fromStorage.version);
        if (typeof fromStorage.version !== 'string') {
            // TODO: define more rigorous type
            console.log('Corrupted save file found: Invalid version number: ' + typeof fromStorage.version);
            return;
        }
        if (fromStorage.version !== master.version) {
            console.log('Outdated version save file found:' + fromStorage.version + ' (Current version: ' + master.version + ')');
            // Logic for upgrading to newer versions goes here.
        }
        // get an array of the properties of saveData
        // would also return functions of an object, but NOT methods from a class apparently, so it's fine
        const propertiesMaster = Object.getOwnPropertyNames(master.data);
        // check if data property exists?
        const propertiesFromStorage = Object.getOwnPropertyNames(fromStorage.data);
        // check each property to make sure it exists on the save data, if not add it
        propertiesMaster.forEach(prop => {
            if (typeof fromStorage.data[prop] === 'undefined') {
                console.log(`${prop} was undefined, adding it to saveData`);
                fromStorage.data[prop] = master.data[prop];
            }
            else if (typeof fromStorage.data[prop] === 'object') {
                // console.log(prop, 'is an object')
                const innerPropertiesMaster = Object.getOwnPropertyNames(master.data[prop]);
                // console.log('innerProperties', innerProperties)
                innerPropertiesMaster.forEach(innerProp => {
                    if (typeof fromStorage.data[prop][innerProp] === 'undefined') {
                        console.log(`${prop}.${innerProp} was undefined, adding it to saveData`);
                        fromStorage.data[prop][innerProp] = master.data[prop][innerProp];
                    }
                });
            }
        });
        // check if there are properties which are deprecated or deleted in a newer version, if so delete them
        propertiesFromStorage.forEach(prop => {
            if (typeof master.data[prop] === 'undefined') {
                console.log(`${prop} should not be in saveData, deleting it from saveData`);
                fromStorage.data[prop] = master.data[prop];
                Reflect.deleteProperty(fromStorage.data, prop);
            }
            else if (typeof master.data[prop] === 'object') {
                const innerPropertiesFromStorage = Object.getOwnPropertyNames(fromStorage.data[prop]);
                innerPropertiesFromStorage.forEach(innerProp => {
                    if (typeof master.data[prop][innerProp] === 'undefined') {
                        console.log(`${prop}.${innerProp} should not be in saveData, deleting it from saveData`);
                        Reflect.deleteProperty(fromStorage.data[prop], innerProp);
                    }
                });
            }
        });
        console.log('Migration complete.');
    }
    /**
     * Resets saveGame in localstorage, resets all the stores and updates the savaData accordingly.
     */
    function resetSaveGame() {
        // update the stored gameModel with a new one
        resetStores();
        if (saveData !== null)
            saveData.updateFromStores();
        sendMessage('Game reset.');
    }
    /**
     * Resets all the stores to their default starting values. (NewGame)
     */
    function resetStores() {
        for (const key in store)
            store[key].reset();
    }
    /**
     * If there already is a saved game, but eg. the base cost of an upgrade changes or its cost multiplier,
     * this function will recalculate the current price for the upgrade
     * Also can be utilized for possible upgrades where the base cost or multiplier of another upgrade changes.
     */
    function recalculateStores() {
        let upgrades$1 = {};
        // maybe change to store.upgrades.update() instead?
        const unsubscribe = upgrades.subscribe($store => {
            upgrades$1 = $store;
        });
        for (const [key, value] of Object.entries(upgrades$1)) {
            value.maxBuy = upgradesInitial[key].maxBuy;
            if (typeof value.maxBuy === 'number' && value.bought > value.maxBuy)
                value.bought = value.maxBuy;
            value.costMultiplier = upgradesInitial[key].costMultiplier;
            value.cost = upgradesInitial[key].cost * Math.pow(upgradesInitial[key].costMultiplier, value.bought);
        }
        upgrades.refresh();
        unsubscribe();
    }
    /**
     * This is where all the important game data to be saved is stored.
     */
    const saveData = new SaveData();
    loadSaveGame();

    /* src/components/dev/DevTools.svelte generated by Svelte v3.44.1 */
    const file$n = "src/components/dev/DevTools.svelte";

    // (5:0) {#if $devToolsEnabled}
    function create_if_block$c(ctx) {
    	let div4;
    	let div3;
    	let strong;
    	let t1;
    	let button0;
    	let t3;
    	let span0;
    	let t5;
    	let input0;
    	let t6;
    	let div0;
    	let button1;
    	let t8;
    	let button2;
    	let t10;
    	let button3;
    	let t12;
    	let button4;
    	let t14;
    	let button5;
    	let t16;
    	let span1;
    	let t18;
    	let input1;
    	let t19;
    	let div1;
    	let button6;
    	let t21;
    	let button7;
    	let t23;
    	let button8;
    	let t25;
    	let button9;
    	let t27;
    	let button10;
    	let t29;
    	let span2;
    	let t31;
    	let input2;
    	let t32;
    	let div2;
    	let button11;
    	let t34;
    	let button12;
    	let t36;
    	let button13;
    	let t38;
    	let button14;
    	let t40;
    	let button15;
    	let t42;
    	let span3;
    	let t44;
    	let input3;
    	let t45;
    	let span4;
    	let t47;
    	let input4;
    	let t48;
    	let span5;
    	let t50;
    	let input5;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div3 = element("div");
    			strong = element("strong");
    			strong.textContent = "Developer Tools";
    			t1 = space();
    			button0 = element("button");
    			button0.textContent = "Recalc Stores";
    			t3 = space();
    			span0 = element("span");
    			span0.textContent = "thoughts";
    			t5 = space();
    			input0 = element("input");
    			t6 = space();
    			div0 = element("div");
    			button1 = element("button");
    			button1.textContent = "+100";
    			t8 = space();
    			button2 = element("button");
    			button2.textContent = "+1K";
    			t10 = space();
    			button3 = element("button");
    			button3.textContent = "+10K";
    			t12 = space();
    			button4 = element("button");
    			button4.textContent = "+100K";
    			t14 = space();
    			button5 = element("button");
    			button5.textContent = "+1M";
    			t16 = space();
    			span1 = element("span");
    			span1.textContent = "cheese";
    			t18 = space();
    			input1 = element("input");
    			t19 = space();
    			div1 = element("div");
    			button6 = element("button");
    			button6.textContent = "+100";
    			t21 = space();
    			button7 = element("button");
    			button7.textContent = "+1K";
    			t23 = space();
    			button8 = element("button");
    			button8.textContent = "+10K";
    			t25 = space();
    			button9 = element("button");
    			button9.textContent = "+100K";
    			t27 = space();
    			button10 = element("button");
    			button10.textContent = "+1M";
    			t29 = space();
    			span2 = element("span");
    			span2.textContent = "moldy cheese";
    			t31 = space();
    			input2 = element("input");
    			t32 = space();
    			div2 = element("div");
    			button11 = element("button");
    			button11.textContent = "+100";
    			t34 = space();
    			button12 = element("button");
    			button12.textContent = "+1K";
    			t36 = space();
    			button13 = element("button");
    			button13.textContent = "+10K";
    			t38 = space();
    			button14 = element("button");
    			button14.textContent = "+100K";
    			t40 = space();
    			button15 = element("button");
    			button15.textContent = "+1M";
    			t42 = space();
    			span3 = element("span");
    			span3.textContent = "cheese monsters";
    			t44 = space();
    			input3 = element("input");
    			t45 = space();
    			span4 = element("span");
    			span4.textContent = "cheese Brains";
    			t47 = space();
    			input4 = element("input");
    			t48 = space();
    			span5 = element("span");
    			span5.textContent = "milk";
    			t50 = space();
    			input5 = element("input");
    			add_location(strong, file$n, 7, 6, 221);
    			add_location(button0, file$n, 8, 6, 261);
    			add_location(span0, file$n, 10, 6, 330);
    			attr_dev(input0, "type", "number");
    			add_location(input0, file$n, 11, 6, 359);
    			add_location(button1, file$n, 13, 8, 459);
    			add_location(button2, file$n, 14, 8, 535);
    			add_location(button3, file$n, 15, 8, 611);
    			add_location(button4, file$n, 16, 8, 689);
    			add_location(button5, file$n, 17, 8, 769);
    			set_style(div0, "display", "flex");
    			add_location(div0, file$n, 12, 6, 422);
    			add_location(span1, file$n, 20, 6, 862);
    			attr_dev(input1, "type", "number");
    			add_location(input1, file$n, 21, 6, 889);
    			add_location(button6, file$n, 23, 8, 987);
    			add_location(button7, file$n, 24, 8, 1061);
    			add_location(button8, file$n, 25, 8, 1135);
    			add_location(button9, file$n, 26, 8, 1211);
    			add_location(button10, file$n, 27, 8, 1289);
    			set_style(div1, "display", "flex");
    			add_location(div1, file$n, 22, 6, 950);
    			add_location(span2, file$n, 30, 6, 1380);
    			attr_dev(input2, "type", "number");
    			add_location(input2, file$n, 31, 6, 1413);
    			add_location(button11, file$n, 33, 8, 1516);
    			add_location(button12, file$n, 34, 8, 1595);
    			add_location(button13, file$n, 35, 8, 1674);
    			add_location(button14, file$n, 36, 8, 1755);
    			add_location(button15, file$n, 37, 8, 1838);
    			set_style(div2, "display", "flex");
    			add_location(div2, file$n, 32, 6, 1479);
    			add_location(span3, file$n, 40, 6, 1934);
    			attr_dev(input3, "type", "number");
    			add_location(input3, file$n, 41, 6, 1970);
    			add_location(span4, file$n, 43, 6, 2040);
    			attr_dev(input4, "type", "number");
    			add_location(input4, file$n, 44, 6, 2074);
    			add_location(span5, file$n, 46, 6, 2143);
    			attr_dev(input5, "type", "number");
    			add_location(input5, file$n, 47, 6, 2168);
    			attr_dev(div3, "id", "devControls");
    			attr_dev(div3, "class", "svelte-gi2kl6");
    			add_location(div3, file$n, 6, 4, 191);
    			attr_dev(div4, "id", "devTools");
    			attr_dev(div4, "class", "svelte-gi2kl6");
    			add_location(div4, file$n, 5, 2, 166);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div3);
    			append_dev(div3, strong);
    			append_dev(div3, t1);
    			append_dev(div3, button0);
    			append_dev(div3, t3);
    			append_dev(div3, span0);
    			append_dev(div3, t5);
    			append_dev(div3, input0);
    			set_input_value(input0, /*$resource*/ ctx[1].thoughts);
    			append_dev(div3, t6);
    			append_dev(div3, div0);
    			append_dev(div0, button1);
    			append_dev(div0, t8);
    			append_dev(div0, button2);
    			append_dev(div0, t10);
    			append_dev(div0, button3);
    			append_dev(div0, t12);
    			append_dev(div0, button4);
    			append_dev(div0, t14);
    			append_dev(div0, button5);
    			append_dev(div3, t16);
    			append_dev(div3, span1);
    			append_dev(div3, t18);
    			append_dev(div3, input1);
    			set_input_value(input1, /*$resource*/ ctx[1].cheese);
    			append_dev(div3, t19);
    			append_dev(div3, div1);
    			append_dev(div1, button6);
    			append_dev(div1, t21);
    			append_dev(div1, button7);
    			append_dev(div1, t23);
    			append_dev(div1, button8);
    			append_dev(div1, t25);
    			append_dev(div1, button9);
    			append_dev(div1, t27);
    			append_dev(div1, button10);
    			append_dev(div3, t29);
    			append_dev(div3, span2);
    			append_dev(div3, t31);
    			append_dev(div3, input2);
    			set_input_value(input2, /*$resource*/ ctx[1].moldyCheese);
    			append_dev(div3, t32);
    			append_dev(div3, div2);
    			append_dev(div2, button11);
    			append_dev(div2, t34);
    			append_dev(div2, button12);
    			append_dev(div2, t36);
    			append_dev(div2, button13);
    			append_dev(div2, t38);
    			append_dev(div2, button14);
    			append_dev(div2, t40);
    			append_dev(div2, button15);
    			append_dev(div3, t42);
    			append_dev(div3, span3);
    			append_dev(div3, t44);
    			append_dev(div3, input3);
    			set_input_value(input3, /*$resource*/ ctx[1].cheeseMonster);
    			append_dev(div3, t45);
    			append_dev(div3, span4);
    			append_dev(div3, t47);
    			append_dev(div3, input4);
    			set_input_value(input4, /*$resource*/ ctx[1].cheeseBrains);
    			append_dev(div3, t48);
    			append_dev(div3, span5);
    			append_dev(div3, t50);
    			append_dev(div3, input5);
    			set_input_value(input5, /*$resource*/ ctx[1].milk);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", recalculateStores, false, false, false),
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[2]),
    					listen_dev(button1, "click", /*click_handler*/ ctx[3], false, false, false),
    					listen_dev(button2, "click", /*click_handler_1*/ ctx[4], false, false, false),
    					listen_dev(button3, "click", /*click_handler_2*/ ctx[5], false, false, false),
    					listen_dev(button4, "click", /*click_handler_3*/ ctx[6], false, false, false),
    					listen_dev(button5, "click", /*click_handler_4*/ ctx[7], false, false, false),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[8]),
    					listen_dev(button6, "click", /*click_handler_5*/ ctx[9], false, false, false),
    					listen_dev(button7, "click", /*click_handler_6*/ ctx[10], false, false, false),
    					listen_dev(button8, "click", /*click_handler_7*/ ctx[11], false, false, false),
    					listen_dev(button9, "click", /*click_handler_8*/ ctx[12], false, false, false),
    					listen_dev(button10, "click", /*click_handler_9*/ ctx[13], false, false, false),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[14]),
    					listen_dev(button11, "click", /*click_handler_10*/ ctx[15], false, false, false),
    					listen_dev(button12, "click", /*click_handler_11*/ ctx[16], false, false, false),
    					listen_dev(button13, "click", /*click_handler_12*/ ctx[17], false, false, false),
    					listen_dev(button14, "click", /*click_handler_13*/ ctx[18], false, false, false),
    					listen_dev(button15, "click", /*click_handler_14*/ ctx[19], false, false, false),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[20]),
    					listen_dev(input4, "input", /*input4_input_handler*/ ctx[21]),
    					listen_dev(input5, "input", /*input5_input_handler*/ ctx[22])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$resource*/ 2 && to_number(input0.value) !== /*$resource*/ ctx[1].thoughts) {
    				set_input_value(input0, /*$resource*/ ctx[1].thoughts);
    			}

    			if (dirty & /*$resource*/ 2 && to_number(input1.value) !== /*$resource*/ ctx[1].cheese) {
    				set_input_value(input1, /*$resource*/ ctx[1].cheese);
    			}

    			if (dirty & /*$resource*/ 2 && to_number(input2.value) !== /*$resource*/ ctx[1].moldyCheese) {
    				set_input_value(input2, /*$resource*/ ctx[1].moldyCheese);
    			}

    			if (dirty & /*$resource*/ 2 && to_number(input3.value) !== /*$resource*/ ctx[1].cheeseMonster) {
    				set_input_value(input3, /*$resource*/ ctx[1].cheeseMonster);
    			}

    			if (dirty & /*$resource*/ 2 && to_number(input4.value) !== /*$resource*/ ctx[1].cheeseBrains) {
    				set_input_value(input4, /*$resource*/ ctx[1].cheeseBrains);
    			}

    			if (dirty & /*$resource*/ 2 && to_number(input5.value) !== /*$resource*/ ctx[1].milk) {
    				set_input_value(input5, /*$resource*/ ctx[1].milk);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$c.name,
    		type: "if",
    		source: "(5:0) {#if $devToolsEnabled}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$n(ctx) {
    	let if_block_anchor;
    	let if_block = /*$devToolsEnabled*/ ctx[0] && create_if_block$c(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$devToolsEnabled*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$c(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$n.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$n($$self, $$props, $$invalidate) {
    	let $devToolsEnabled;
    	let $resource;
    	validate_store(devToolsEnabled, 'devToolsEnabled');
    	component_subscribe($$self, devToolsEnabled, $$value => $$invalidate(0, $devToolsEnabled = $$value));
    	validate_store(resource, 'resource');
    	component_subscribe($$self, resource, $$value => $$invalidate(1, $resource = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('DevTools', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<DevTools> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		$resource.thoughts = to_number(this.value);
    		resource.set($resource);
    	}

    	const click_handler = () => set_store_value(resource, $resource.thoughts += 100, $resource);
    	const click_handler_1 = () => set_store_value(resource, $resource.thoughts += 1000, $resource);
    	const click_handler_2 = () => set_store_value(resource, $resource.thoughts += 10000, $resource);
    	const click_handler_3 = () => set_store_value(resource, $resource.thoughts += 100000, $resource);
    	const click_handler_4 = () => set_store_value(resource, $resource.thoughts += 1000000, $resource);

    	function input1_input_handler() {
    		$resource.cheese = to_number(this.value);
    		resource.set($resource);
    	}

    	const click_handler_5 = () => set_store_value(resource, $resource.cheese += 100, $resource);
    	const click_handler_6 = () => set_store_value(resource, $resource.cheese += 1000, $resource);
    	const click_handler_7 = () => set_store_value(resource, $resource.cheese += 10000, $resource);
    	const click_handler_8 = () => set_store_value(resource, $resource.cheese += 100000, $resource);
    	const click_handler_9 = () => set_store_value(resource, $resource.cheese += 1000000, $resource);

    	function input2_input_handler() {
    		$resource.moldyCheese = to_number(this.value);
    		resource.set($resource);
    	}

    	const click_handler_10 = () => set_store_value(resource, $resource.moldyCheese += 100, $resource);
    	const click_handler_11 = () => set_store_value(resource, $resource.moldyCheese += 1000, $resource);
    	const click_handler_12 = () => set_store_value(resource, $resource.moldyCheese += 10000, $resource);
    	const click_handler_13 = () => set_store_value(resource, $resource.moldyCheese += 100000, $resource);
    	const click_handler_14 = () => set_store_value(resource, $resource.moldyCheese += 1000000, $resource);

    	function input3_input_handler() {
    		$resource.cheeseMonster = to_number(this.value);
    		resource.set($resource);
    	}

    	function input4_input_handler() {
    		$resource.cheeseBrains = to_number(this.value);
    		resource.set($resource);
    	}

    	function input5_input_handler() {
    		$resource.milk = to_number(this.value);
    		resource.set($resource);
    	}

    	$$self.$capture_state = () => ({
    		devToolsEnabled,
    		resource,
    		recalculateStores,
    		$devToolsEnabled,
    		$resource
    	});

    	return [
    		$devToolsEnabled,
    		$resource,
    		input0_input_handler,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4,
    		input1_input_handler,
    		click_handler_5,
    		click_handler_6,
    		click_handler_7,
    		click_handler_8,
    		click_handler_9,
    		input2_input_handler,
    		click_handler_10,
    		click_handler_11,
    		click_handler_12,
    		click_handler_13,
    		click_handler_14,
    		input3_input_handler,
    		input4_input_handler,
    		input5_input_handler
    	];
    }

    class DevTools extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$n, create_fragment$n, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DevTools",
    			options,
    			id: create_fragment$n.name
    		});
    	}
    }

    /* src/components/dev/ToggleUnlocks.svelte generated by Svelte v3.44.1 */

    const { Object: Object_1$1, console: console_1$1 } = globals;
    const file$m = "src/components/dev/ToggleUnlocks.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i][0];
    	child_ctx[4] = list[i][1];
    	child_ctx[6] = i;
    	return child_ctx;
    }

    // (9:2) {#each Object.entries($unlocked) as [name, isUnlocked], id}
    function create_each_block$3(ctx) {
    	let button;
    	let t0;
    	let t1;
    	let t2_value = /*name*/ ctx[3] + "";
    	let t2;
    	let t3;
    	let t4_value = (/*isUnlocked*/ ctx[4] ? '✅' : '❌') + "";
    	let t4;
    	let t5;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[2](/*name*/ ctx[3]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			t0 = text(/*id*/ ctx[6]);
    			t1 = space();
    			t2 = text(t2_value);
    			t3 = space();
    			t4 = text(t4_value);
    			t5 = space();
    			attr_dev(button, "class", "svelte-fzjkju");
    			add_location(button, file$m, 9, 4, 242);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t0);
    			append_dev(button, t1);
    			append_dev(button, t2);
    			append_dev(button, t3);
    			append_dev(button, t4);
    			append_dev(button, t5);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*$unlocked*/ 1 && t2_value !== (t2_value = /*name*/ ctx[3] + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*$unlocked*/ 1 && t4_value !== (t4_value = (/*isUnlocked*/ ctx[4] ? '✅' : '❌') + "")) set_data_dev(t4, t4_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(9:2) {#each Object.entries($unlocked) as [name, isUnlocked], id}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$m(ctx) {
    	let div;
    	let each_value = Object.entries(/*$unlocked*/ ctx[0]);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "svelte-fzjkju");
    			add_location(div, file$m, 7, 0, 170);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*toggleUnlock, Object, $unlocked*/ 3) {
    				each_value = Object.entries(/*$unlocked*/ ctx[0]);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$m.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$m($$self, $$props, $$invalidate) {
    	let $unlocked;
    	validate_store(unlocked, 'unlocked');
    	component_subscribe($$self, unlocked, $$value => $$invalidate(0, $unlocked = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ToggleUnlocks', slots, []);

    	function toggleUnlock(name) {
    		set_store_value(unlocked, $unlocked[name] = !$unlocked[name], $unlocked);
    		console.log($unlocked[name]);
    	}

    	const writable_props = [];

    	Object_1$1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<ToggleUnlocks> was created with unknown prop '${key}'`);
    	});

    	const click_handler = name => toggleUnlock(name);
    	$$self.$capture_state = () => ({ unlocked, toggleUnlock, $unlocked });
    	return [$unlocked, toggleUnlock, click_handler];
    }

    class ToggleUnlocks extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$m, create_fragment$m, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ToggleUnlocks",
    			options,
    			id: create_fragment$m.name
    		});
    	}
    }

    /* src/components/game-windows/window-model/Window.svelte generated by Svelte v3.44.1 */
    const file$l = "src/components/game-windows/window-model/Window.svelte";

    function create_fragment$l(ctx) {
    	let div5;
    	let div0;
    	let t0;
    	let div1;
    	let t1;
    	let div2;
    	let t2;
    	let div3;
    	let t3;
    	let div4;
    	let div5_transition;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			div0 = element("div");
    			if (default_slot) default_slot.c();
    			t0 = space();
    			div1 = element("div");
    			t1 = space();
    			div2 = element("div");
    			t2 = space();
    			div3 = element("div");
    			t3 = space();
    			div4 = element("div");
    			attr_dev(div0, "class", "content svelte-1pw23el");
    			add_location(div0, file$l, 11, 2, 398);
    			attr_dev(div1, "class", "corner svelte-1pw23el");
    			attr_dev(div1, "id", "corner-top-right");
    			add_location(div1, file$l, 15, 2, 445);
    			attr_dev(div2, "class", "corner svelte-1pw23el");
    			attr_dev(div2, "id", "corner-top-left");
    			add_location(div2, file$l, 16, 2, 492);
    			attr_dev(div3, "class", "corner svelte-1pw23el");
    			attr_dev(div3, "id", "corner-bottom-right");
    			add_location(div3, file$l, 17, 2, 538);
    			attr_dev(div4, "class", "corner svelte-1pw23el");
    			attr_dev(div4, "id", "corner-bottom-left");
    			add_location(div4, file$l, 18, 2, 588);
    			attr_dev(div5, "class", "container  svelte-1pw23el");
    			attr_dev(div5, "data-title", /*title*/ ctx[0]);
    			attr_dev(div5, "style", /*style*/ ctx[1]);
    			add_location(div5, file$l, 7, 0, 221);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div0);

    			if (default_slot) {
    				default_slot.m(div0, null);
    			}

    			append_dev(div5, t0);
    			append_dev(div5, div1);
    			append_dev(div5, t1);
    			append_dev(div5, div2);
    			append_dev(div5, t2);
    			append_dev(div5, div3);
    			append_dev(div5, t3);
    			append_dev(div5, div4);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 16)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[4],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[4])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[4], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*title*/ 1) {
    				attr_dev(div5, "data-title", /*title*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);

    			add_render_callback(() => {
    				if (!div5_transition) div5_transition = create_bidirectional_transition(div5, fade, { duration: 1000 }, true);
    				div5_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			if (!div5_transition) div5_transition = create_bidirectional_transition(div5, fade, { duration: 1000 }, false);
    			div5_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
    			if (default_slot) default_slot.d(detaching);
    			if (detaching && div5_transition) div5_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$l($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Window', slots, ['default']);
    	let { title = '' } = $$props;
    	let { themeColor1 } = $$props;
    	let { themeColor2 } = $$props;
    	const style = `--themeColor1: ${themeColor1}; --themeColor2: ${themeColor2};`;
    	const writable_props = ['title', 'themeColor1', 'themeColor2'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Window> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('themeColor1' in $$props) $$invalidate(2, themeColor1 = $$props.themeColor1);
    		if ('themeColor2' in $$props) $$invalidate(3, themeColor2 = $$props.themeColor2);
    		if ('$$scope' in $$props) $$invalidate(4, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		fade,
    		title,
    		themeColor1,
    		themeColor2,
    		style
    	});

    	$$self.$inject_state = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('themeColor1' in $$props) $$invalidate(2, themeColor1 = $$props.themeColor1);
    		if ('themeColor2' in $$props) $$invalidate(3, themeColor2 = $$props.themeColor2);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [title, style, themeColor1, themeColor2, $$scope, slots];
    }

    class Window extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$l, create_fragment$l, safe_not_equal, { title: 0, themeColor1: 2, themeColor2: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Window",
    			options,
    			id: create_fragment$l.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*themeColor1*/ ctx[2] === undefined && !('themeColor1' in props)) {
    			console.warn("<Window> was created without expected prop 'themeColor1'");
    		}

    		if (/*themeColor2*/ ctx[3] === undefined && !('themeColor2' in props)) {
    			console.warn("<Window> was created without expected prop 'themeColor2'");
    		}
    	}

    	get title() {
    		throw new Error("<Window>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Window>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get themeColor1() {
    		throw new Error("<Window>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set themeColor1(value) {
    		throw new Error("<Window>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get themeColor2() {
    		throw new Error("<Window>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set themeColor2(value) {
    		throw new Error("<Window>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/tooltips/Tooltip.svelte generated by Svelte v3.44.1 */

    const file$k = "src/components/tooltips/Tooltip.svelte";

    // (11:2) {:else}
    function create_else_block$5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Error: Invalid tooltip data type");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$5.name,
    		type: "else",
    		source: "(11:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (9:2) {#if typeof data === 'string'}
    function create_if_block$b(ctx) {
    	let html_tag;
    	let html_anchor;

    	const block = {
    		c: function create() {
    			html_tag = new HtmlTag();
    			html_anchor = empty();
    			html_tag.a = html_anchor;
    		},
    		m: function mount(target, anchor) {
    			html_tag.m(/*data*/ ctx[0], target, anchor);
    			insert_dev(target, html_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*data*/ 1) html_tag.p(/*data*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(html_anchor);
    			if (detaching) html_tag.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$b.name,
    		type: "if",
    		source: "(9:2) {#if typeof data === 'string'}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$k(ctx) {
    	let div;

    	function select_block_type(ctx, dirty) {
    		if (typeof /*data*/ ctx[0] === 'string') return create_if_block$b;
    		return create_else_block$5;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			attr_dev(div, "class", "tooltip-arrow-up");
    			attr_dev(div, "style", /*style*/ ctx[1]);
    			add_location(div, file$k, 7, 0, 233);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_block.m(div, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div, null);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$k($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Tooltip', slots, []);
    	let { top = 0 } = $$props;
    	let { left = 0 } = $$props;
    	let { data = 'No Tooltip' } = $$props;

    	/* const style = `top: ${rect.bottom + 10}px; left: ${rect.left + 4}px;` */
    	const style = `top: ${top}px; left: ${left + 4}px;`;

    	const writable_props = ['top', 'left', 'data'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Tooltip> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('top' in $$props) $$invalidate(2, top = $$props.top);
    		if ('left' in $$props) $$invalidate(3, left = $$props.left);
    		if ('data' in $$props) $$invalidate(0, data = $$props.data);
    	};

    	$$self.$capture_state = () => ({ top, left, data, style });

    	$$self.$inject_state = $$props => {
    		if ('top' in $$props) $$invalidate(2, top = $$props.top);
    		if ('left' in $$props) $$invalidate(3, left = $$props.left);
    		if ('data' in $$props) $$invalidate(0, data = $$props.data);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [data, style, top, left];
    }

    class Tooltip extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$k, create_fragment$k, safe_not_equal, { top: 2, left: 3, data: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tooltip",
    			options,
    			id: create_fragment$k.name
    		});
    	}

    	get top() {
    		throw new Error("<Tooltip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set top(value) {
    		throw new Error("<Tooltip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get left() {
    		throw new Error("<Tooltip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set left(value) {
    		throw new Error("<Tooltip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get data() {
    		throw new Error("<Tooltip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<Tooltip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Direction;
    (function (Direction) {
        Direction["TOP"] = "top";
        Direction["RIGHT"] = "right";
        Direction["LEFT"] = "left";
        Direction["BOTTOM"] = "bottom";
    })(Direction || (Direction = {}));
    function tooltip(element, options) {
        var _a, _b;
        let tooltipComponent;
        const TooltipConstructor = (_a = options.Component) !== null && _a !== void 0 ? _a : Tooltip;
        let tooltipData = (_b = options.data) !== null && _b !== void 0 ? _b : null;
        let mousePressed = false;
        let tooltipShown = false;
        function mouseEnter(_event) {
            var _a, _b, _c, _d;
            if (tooltipData === null || mousePressed)
                return;
            let rect;
            let top;
            let left;
            if (options.anchor === 'parentElement') {
                rect = (_b = (_a = element.parentElement) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect()) !== null && _b !== void 0 ? _b : new DOMRect(0, 0, 0, 0);
            }
            else if (options.anchor === 'offsetParent') {
                rect = (_d = (_c = element.offsetParent) === null || _c === void 0 ? void 0 : _c.getBoundingClientRect()) !== null && _d !== void 0 ? _d : new DOMRect(0, 0, 0, 0);
            }
            else {
                rect = element.getBoundingClientRect();
            }
            if (options.direction === Direction.RIGHT) {
                top = rect.top;
                left = rect.right + 8;
            }
            else {
                top = rect.bottom + 10;
                left = rect.left;
            }
            tooltipComponent = new TooltipConstructor({
                props: {
                    data: tooltipData,
                    top,
                    left,
                },
                target: document.body,
            });
            tooltipShown = true;
        }
        function mouseLeave() {
            if (tooltipData === null || mousePressed)
                return;
            tooltipComponent.$destroy();
        }
        function mouseMove(_event) {
            if (tooltipData === null || !mousePressed || !tooltipShown)
                return;
            tooltipComponent.$destroy();
            tooltipShown = false;
            /*  tooltipComponent.$set({
              x: event.pageX,
              y: event.pageY,
            }) */
        }
        function mouseDown(_event) {
            mousePressed = true;
        }
        function mouseUp(event) {
            mousePressed = false;
            if (!tooltipShown)
                mouseEnter();
        }
        element.addEventListener('mouseenter', mouseEnter);
        element.addEventListener('mousemove', mouseMove);
        element.addEventListener('mouseleave', mouseLeave);
        element.addEventListener('mousedown', mouseDown);
        element.addEventListener('mouseup', mouseUp);
        return {
            // is called whenever the parameter (options) changes
            // argument is the new parameter
            update({ data }) {
                // update the local variable from here, else the tooltip would reset
                // to the starting value if it's destroyed and created again
                tooltipData = data;
                // programmatically sets props on an instance. component.$set({ x: 1 })
                // is equivalent to x = 1 inside the component's <script> block.
                if (tooltipComponent !== undefined)
                    tooltipComponent.$set({ data });
            },
            destroy() {
                if (tooltipComponent !== undefined)
                    tooltipComponent.$destroy();
                element.removeEventListener('mouseenter', mouseEnter);
                element.removeEventListener('mousemove', mouseMove);
                element.removeEventListener('mouseleave', mouseLeave);
                element.removeEventListener('mousedown', mouseDown);
                element.removeEventListener('mouseup', mouseUp);
            },
        };
    }

    /* src/components/tooltips/UnlockTooltip.svelte generated by Svelte v3.44.1 */
    const file$j = "src/components/tooltips/UnlockTooltip.svelte";

    function create_fragment$j(ctx) {
    	let div3;
    	let span0;
    	let t0_value = /*data*/ ctx[0].title + "";
    	let t0;
    	let t1;
    	let hr;
    	let t2;
    	let span1;
    	let raw0_value = /*data*/ ctx[0].description + "";
    	let t3;
    	let span2;
    	let raw1_value = /*data*/ ctx[0].tooltipText + "";
    	let t4;
    	let div2;
    	let div0;
    	let t5_value = /*data*/ ctx[0].type + "";
    	let t5;
    	let t6;
    	let div1;
    	let t7_value = formatWhole(/*data*/ ctx[0].cost) + "";
    	let t7;
    	let t8;
    	let t9_value = formatResourceName(/*data*/ ctx[0].resource) + "";
    	let t9;

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			span0 = element("span");
    			t0 = text(t0_value);
    			t1 = space();
    			hr = element("hr");
    			t2 = space();
    			span1 = element("span");
    			t3 = space();
    			span2 = element("span");
    			t4 = space();
    			div2 = element("div");
    			div0 = element("div");
    			t5 = text(t5_value);
    			t6 = space();
    			div1 = element("div");
    			t7 = text(t7_value);
    			t8 = space();
    			t9 = text(t9_value);
    			attr_dev(span0, "id", "title");
    			attr_dev(span0, "class", "svelte-o6gxua");
    			add_location(span0, file$j, 17, 2, 598);
    			attr_dev(hr, "class", "svelte-o6gxua");
    			add_location(hr, file$j, 18, 2, 638);
    			attr_dev(span1, "id", "description");
    			attr_dev(span1, "class", "svelte-o6gxua");
    			add_location(span1, file$j, 19, 2, 648);
    			attr_dev(span2, "id", "tooltip");
    			attr_dev(span2, "class", "svelte-o6gxua");
    			add_location(span2, file$j, 20, 2, 706);
    			attr_dev(div0, "id", "type");
    			set_style(div0, "background", /*background*/ ctx[3].Boost);
    			attr_dev(div0, "class", "svelte-o6gxua");
    			add_location(div0, file$j, 23, 4, 865);
    			attr_dev(div1, "id", "cost");
    			set_style(div1, "color", /*costColor*/ ctx[1]);
    			attr_dev(div1, "class", "svelte-o6gxua");
    			add_location(div1, file$j, 24, 4, 941);
    			set_style(div2, "display", "flex");
    			set_style(div2, "flex-direction", "row");
    			set_style(div2, "justify-content", "space-between");
    			set_style(div2, "margin-top", "4px ");
    			attr_dev(div2, "class", "svelte-o6gxua");
    			add_location(div2, file$j, 22, 2, 762);
    			attr_dev(div3, "id", "window");
    			attr_dev(div3, "style", /*style*/ ctx[2]);
    			attr_dev(div3, "class", "svelte-o6gxua");
    			add_location(div3, file$j, 16, 0, 569);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, span0);
    			append_dev(span0, t0);
    			append_dev(div3, t1);
    			append_dev(div3, hr);
    			append_dev(div3, t2);
    			append_dev(div3, span1);
    			span1.innerHTML = raw0_value;
    			append_dev(div3, t3);
    			append_dev(div3, span2);
    			span2.innerHTML = raw1_value;
    			append_dev(div3, t4);
    			append_dev(div3, div2);
    			append_dev(div2, div0);
    			append_dev(div0, t5);
    			append_dev(div2, t6);
    			append_dev(div2, div1);
    			append_dev(div1, t7);
    			append_dev(div1, t8);
    			append_dev(div1, t9);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*data*/ 1 && t0_value !== (t0_value = /*data*/ ctx[0].title + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*data*/ 1 && raw0_value !== (raw0_value = /*data*/ ctx[0].description + "")) span1.innerHTML = raw0_value;			if (dirty & /*data*/ 1 && raw1_value !== (raw1_value = /*data*/ ctx[0].tooltipText + "")) span2.innerHTML = raw1_value;			if (dirty & /*data*/ 1 && t5_value !== (t5_value = /*data*/ ctx[0].type + "")) set_data_dev(t5, t5_value);
    			if (dirty & /*data*/ 1 && t7_value !== (t7_value = formatWhole(/*data*/ ctx[0].cost) + "")) set_data_dev(t7, t7_value);
    			if (dirty & /*data*/ 1 && t9_value !== (t9_value = formatResourceName(/*data*/ ctx[0].resource) + "")) set_data_dev(t9, t9_value);

    			if (dirty & /*costColor*/ 2) {
    				set_style(div1, "color", /*costColor*/ ctx[1]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props, $$invalidate) {
    	let costColor;
    	let $resource;
    	validate_store(resource, 'resource');
    	component_subscribe($$self, resource, $$value => $$invalidate(6, $resource = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('UnlockTooltip', slots, []);
    	let { data } = $$props;
    	let { top } = $$props;
    	let { left } = $$props;

    	// export let rect: DOMRect
    	const style = `top: ${top}px; left: ${left}px;`;

    	const background = {
    		Boost: 'linear-gradient(to top, var(--Gray400) 20%, white 80%)',
    		Unlock: 'linear-gradient(0deg, yellow 20%, rgba(255,251,125,1) 80%',
    		Mechanic: 'green',
    		Effect: 'blue'
    	};

    	const writable_props = ['data', 'top', 'left'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<UnlockTooltip> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('data' in $$props) $$invalidate(0, data = $$props.data);
    		if ('top' in $$props) $$invalidate(4, top = $$props.top);
    		if ('left' in $$props) $$invalidate(5, left = $$props.left);
    	};

    	$$self.$capture_state = () => ({
    		formatResourceName,
    		formatWhole,
    		resource,
    		data,
    		top,
    		left,
    		style,
    		background,
    		costColor,
    		$resource
    	});

    	$$self.$inject_state = $$props => {
    		if ('data' in $$props) $$invalidate(0, data = $$props.data);
    		if ('top' in $$props) $$invalidate(4, top = $$props.top);
    		if ('left' in $$props) $$invalidate(5, left = $$props.left);
    		if ('costColor' in $$props) $$invalidate(1, costColor = $$props.costColor);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$resource, data*/ 65) {
    			$$invalidate(1, costColor = $resource[data.resource] > data.cost
    			? 'rgb(102, 255, 102)'
    			: 'rgb(255, 102, 102)');
    		}
    	};

    	return [data, costColor, style, background, top, left, $resource];
    }

    class UnlockTooltip extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$j, create_fragment$j, safe_not_equal, { data: 0, top: 4, left: 5 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "UnlockTooltip",
    			options,
    			id: create_fragment$j.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*data*/ ctx[0] === undefined && !('data' in props)) {
    			console.warn("<UnlockTooltip> was created without expected prop 'data'");
    		}

    		if (/*top*/ ctx[4] === undefined && !('top' in props)) {
    			console.warn("<UnlockTooltip> was created without expected prop 'top'");
    		}

    		if (/*left*/ ctx[5] === undefined && !('left' in props)) {
    			console.warn("<UnlockTooltip> was created without expected prop 'left'");
    		}
    	}

    	get data() {
    		throw new Error("<UnlockTooltip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<UnlockTooltip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get top() {
    		throw new Error("<UnlockTooltip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set top(value) {
    		throw new Error("<UnlockTooltip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get left() {
    		throw new Error("<UnlockTooltip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set left(value) {
    		throw new Error("<UnlockTooltip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/UnlockIcon.svelte generated by Svelte v3.44.1 */
    const file$i = "src/components/UnlockIcon.svelte";

    function create_fragment$i(ctx) {
    	let div;
    	let button;
    	let img;
    	let img_src_value;
    	let button_data_cost_value;
    	let button_data_unlocktype_value;
    	let tooltip_action;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			button = element("button");
    			img = element("img");
    			attr_dev(img, "alt", "upgrade icon");
    			if (!src_url_equal(img.src, img_src_value = `assets/${/*folderName*/ ctx[2]}/PNG/${/*tempCount*/ ctx[1] + 1}.png`)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "draggable", "false");
    			attr_dev(img, "class", "svelte-q4pav3");
    			add_location(img, file$i, 28, 4, 1018);
    			attr_dev(button, "data-cost", button_data_cost_value = formatWhole(/*unlock*/ ctx[0].cost));
    			attr_dev(button, "data-unlocktype", button_data_unlocktype_value = /*unlock*/ ctx[0].type);
    			attr_dev(button, "class", "svelte-q4pav3");
    			toggle_class(button, "disabled", /*$unlocked*/ ctx[4][/*unlock*/ ctx[0].name] || /*$resource*/ ctx[3][/*unlock*/ ctx[0].resource] < /*unlock*/ ctx[0].cost);
    			toggle_class(button, "unlocked", /*$unlocked*/ ctx[4][/*unlock*/ ctx[0].name]);
    			add_location(button, file$i, 20, 2, 653);
    			set_style(div, "height", "max-content");
    			set_style(div, "width", "max-content");
    			add_location(div, file$i, 19, 0, 598);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, button);
    			append_dev(button, img);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button, "click", /*unlockFeature*/ ctx[5], false, false, false),
    					action_destroyer(tooltip_action = tooltip.call(null, button, {
    						data: /*unlock*/ ctx[0],
    						Component: UnlockTooltip,
    						direction: Direction.RIGHT,
    						anchor: 'offsetParent'
    					}))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*folderName, tempCount*/ 6 && !src_url_equal(img.src, img_src_value = `assets/${/*folderName*/ ctx[2]}/PNG/${/*tempCount*/ ctx[1] + 1}.png`)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*unlock*/ 1 && button_data_cost_value !== (button_data_cost_value = formatWhole(/*unlock*/ ctx[0].cost))) {
    				attr_dev(button, "data-cost", button_data_cost_value);
    			}

    			if (dirty & /*unlock*/ 1 && button_data_unlocktype_value !== (button_data_unlocktype_value = /*unlock*/ ctx[0].type)) {
    				attr_dev(button, "data-unlocktype", button_data_unlocktype_value);
    			}

    			if (tooltip_action && is_function(tooltip_action.update) && dirty & /*unlock*/ 1) tooltip_action.update.call(null, {
    				data: /*unlock*/ ctx[0],
    				Component: UnlockTooltip,
    				direction: Direction.RIGHT,
    				anchor: 'offsetParent'
    			});

    			if (dirty & /*$unlocked, unlock, $resource*/ 25) {
    				toggle_class(button, "disabled", /*$unlocked*/ ctx[4][/*unlock*/ ctx[0].name] || /*$resource*/ ctx[3][/*unlock*/ ctx[0].resource] < /*unlock*/ ctx[0].cost);
    			}

    			if (dirty & /*$unlocked, unlock*/ 17) {
    				toggle_class(button, "unlocked", /*$unlocked*/ ctx[4][/*unlock*/ ctx[0].name]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props, $$invalidate) {
    	let $resource;
    	let $unlocked;
    	validate_store(resource, 'resource');
    	component_subscribe($$self, resource, $$value => $$invalidate(3, $resource = $$value));
    	validate_store(unlocked, 'unlocked');
    	component_subscribe($$self, unlocked, $$value => $$invalidate(4, $unlocked = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('UnlockIcon', slots, []);
    	let { unlock } = $$props;
    	let { tempCount } = $$props;
    	let { folderName } = $$props;

    	function unlockFeature() {
    		const cost = unlock.cost;
    		if ($resource[unlock.resource] < cost || $unlocked[unlock.name]) return;
    		set_store_value(resource, $resource[unlock.resource] -= cost, $resource);

    		unlocked.update($unlocked => {
    			$unlocked[unlock.name] = true;
    			return $unlocked;
    		});
    	}

    	const writable_props = ['unlock', 'tempCount', 'folderName'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<UnlockIcon> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('unlock' in $$props) $$invalidate(0, unlock = $$props.unlock);
    		if ('tempCount' in $$props) $$invalidate(1, tempCount = $$props.tempCount);
    		if ('folderName' in $$props) $$invalidate(2, folderName = $$props.folderName);
    	};

    	$$self.$capture_state = () => ({
    		formatWhole,
    		unlocked,
    		resource,
    		Direction,
    		tooltip,
    		UnlockTooltip,
    		unlock,
    		tempCount,
    		folderName,
    		unlockFeature,
    		$resource,
    		$unlocked
    	});

    	$$self.$inject_state = $$props => {
    		if ('unlock' in $$props) $$invalidate(0, unlock = $$props.unlock);
    		if ('tempCount' in $$props) $$invalidate(1, tempCount = $$props.tempCount);
    		if ('folderName' in $$props) $$invalidate(2, folderName = $$props.folderName);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [unlock, tempCount, folderName, $resource, $unlocked, unlockFeature];
    }

    class UnlockIcon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$i, create_fragment$i, safe_not_equal, { unlock: 0, tempCount: 1, folderName: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "UnlockIcon",
    			options,
    			id: create_fragment$i.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*unlock*/ ctx[0] === undefined && !('unlock' in props)) {
    			console.warn("<UnlockIcon> was created without expected prop 'unlock'");
    		}

    		if (/*tempCount*/ ctx[1] === undefined && !('tempCount' in props)) {
    			console.warn("<UnlockIcon> was created without expected prop 'tempCount'");
    		}

    		if (/*folderName*/ ctx[2] === undefined && !('folderName' in props)) {
    			console.warn("<UnlockIcon> was created without expected prop 'folderName'");
    		}
    	}

    	get unlock() {
    		throw new Error("<UnlockIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set unlock(value) {
    		throw new Error("<UnlockIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tempCount() {
    		throw new Error("<UnlockIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tempCount(value) {
    		throw new Error("<UnlockIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get folderName() {
    		throw new Error("<UnlockIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set folderName(value) {
    		throw new Error("<UnlockIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/UnlockDrawer.svelte generated by Svelte v3.44.1 */
    const file$h = "src/components/UnlockDrawer.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	child_ctx[5] = i;
    	return child_ctx;
    }

    // (10:6) {#if !$unlocked[unlock.name] && $unlocked[unlock.availableAt ?? 'start']}
    function create_if_block$a(ctx) {
    	let unlockicon;
    	let current;

    	unlockicon = new UnlockIcon({
    			props: {
    				unlock: /*unlock*/ ctx[3],
    				tempCount: /*tempCount*/ ctx[5],
    				folderName: /*folderName*/ ctx[1]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(unlockicon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(unlockicon, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const unlockicon_changes = {};
    			if (dirty & /*unlocks*/ 1) unlockicon_changes.unlock = /*unlock*/ ctx[3];
    			if (dirty & /*folderName*/ 2) unlockicon_changes.folderName = /*folderName*/ ctx[1];
    			unlockicon.$set(unlockicon_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(unlockicon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(unlockicon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(unlockicon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$a.name,
    		type: "if",
    		source: "(10:6) {#if !$unlocked[unlock.name] && $unlocked[unlock.availableAt ?? 'start']}",
    		ctx
    	});

    	return block;
    }

    // (9:4) {#each unlocks as unlock, tempCount}
    function create_each_block$2(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = !/*$unlocked*/ ctx[2][/*unlock*/ ctx[3].name] && /*$unlocked*/ ctx[2][/*unlock*/ ctx[3].availableAt ?? 'start'] && create_if_block$a(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!/*$unlocked*/ ctx[2][/*unlock*/ ctx[3].name] && /*$unlocked*/ ctx[2][/*unlock*/ ctx[3].availableAt ?? 'start']) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$unlocked, unlocks*/ 5) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$a(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(9:4) {#each unlocks as unlock, tempCount}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$h(ctx) {
    	let div1;
    	let div0;
    	let current;
    	let each_value = /*unlocks*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div0, "class", "unlockDrawer grid theme-border svelte-140b3zo");
    			add_location(div0, file$h, 7, 2, 233);
    			set_style(div1, "position", "relative");
    			set_style(div1, "width", "max-content");
    			set_style(div1, "height", "max-content");
    			attr_dev(div1, "class", "svelte-140b3zo");
    			add_location(div1, file$h, 6, 0, 158);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*unlocks, folderName, $unlocked*/ 7) {
    				each_value = /*unlocks*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div0, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let $unlocked;
    	validate_store(unlocked, 'unlocked');
    	component_subscribe($$self, unlocked, $$value => $$invalidate(2, $unlocked = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('UnlockDrawer', slots, []);
    	let { unlocks } = $$props;
    	let { folderName = '' } = $$props;
    	const writable_props = ['unlocks', 'folderName'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<UnlockDrawer> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('unlocks' in $$props) $$invalidate(0, unlocks = $$props.unlocks);
    		if ('folderName' in $$props) $$invalidate(1, folderName = $$props.folderName);
    	};

    	$$self.$capture_state = () => ({
    		unlocked,
    		UnlockIcon,
    		unlocks,
    		folderName,
    		$unlocked
    	});

    	$$self.$inject_state = $$props => {
    		if ('unlocks' in $$props) $$invalidate(0, unlocks = $$props.unlocks);
    		if ('folderName' in $$props) $$invalidate(1, folderName = $$props.folderName);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [unlocks, folderName, $unlocked];
    }

    class UnlockDrawer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, { unlocks: 0, folderName: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "UnlockDrawer",
    			options,
    			id: create_fragment$h.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*unlocks*/ ctx[0] === undefined && !('unlocks' in props)) {
    			console.warn("<UnlockDrawer> was created without expected prop 'unlocks'");
    		}
    	}

    	get unlocks() {
    		throw new Error("<UnlockDrawer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set unlocks(value) {
    		throw new Error("<UnlockDrawer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get folderName() {
    		throw new Error("<UnlockDrawer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set folderName(value) {
    		throw new Error("<UnlockDrawer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function buyUpgrade(upgrades) {
        // - upgrades is scoped here -
        return function (upgradeName, buyMaxUpgrades = false) {
            upgrades.update($store => {
                // what if property upgradeName doesnt exist on $store?
                const upgrade = $store[upgradeName];
                let checkoutCost = 0;
                const res = get_store_value(resource)[upgrade.resource];
                if (res < upgrade.cost)
                    return $store;
                if (!buyMaxUpgrades) {
                    // PURCHASE SINGLE:
                    checkoutCost = upgrade.cost;
                    upgrade.cost *= upgrade.costMultiplier;
                    upgrade.bought++;
                }
                else {
                    // PURCHASE MAX:
                    const cost = upgrade.cost;
                    const costMult = upgrade.costMultiplier;
                    // used formulas for geometric series (because of the exponential cost curve of the upgrades)
                    const numUpgradesAffordable = Math.floor(Math.log((res / cost) * (costMult - 1) + 1) / Math.log(costMult));
                    const totalPrice = (cost * (Math.pow(costMult, numUpgradesAffordable) - 1)) / (costMult - 1);
                    checkoutCost = totalPrice;
                    upgrade.cost *= Math.pow(costMult, numUpgradesAffordable);
                    upgrade.bought += numUpgradesAffordable;
                    // alert("Upgrades affordable: " + numUpgradesAffordable + ", Total Prize: " + totalPrice)
                }
                resource.update($resource => {
                    $resource[upgrade.resource] -= checkoutCost;
                    return $resource;
                });
                return $store;
            });
        };
    }

    /* src/components/UpgradeButton.svelte generated by Svelte v3.44.1 */
    const file$g = "src/components/UpgradeButton.svelte";

    // (58:0) {:else}
    function create_else_block_2$2(ctx) {
    	let button;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "???";
    			button.disabled = true;
    			attr_dev(button, "class", "svelte-185etb5");
    			add_location(button, file$g, 58, 2, 1965);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_2$2.name,
    		type: "else",
    		source: "(58:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (26:0) {#if btnUnlocked || $LORCA_OVERRIDE}
    function create_if_block$9(ctx) {
    	let button;
    	let div2;
    	let div0;
    	let t0;
    	let div1;
    	let t1;
    	let div3;
    	let tooltip_action;
    	let button_transition;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[18].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[17], null);
    	let if_block0 = !/*$isMaxed*/ ctx[4] && create_if_block_3$4(ctx);

    	function select_block_type_1(ctx, dirty) {
    		if (/*$maxBuy*/ ctx[6] !== null) return create_if_block_1$7;
    		return create_else_block_1$2;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block1 = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			button = element("button");
    			div2 = element("div");
    			div0 = element("div");
    			if (default_slot) default_slot.c();
    			t0 = space();
    			div1 = element("div");
    			if (if_block0) if_block0.c();
    			t1 = space();
    			div3 = element("div");
    			if_block1.c();
    			attr_dev(div0, "id", "text");
    			attr_dev(div0, "class", "svelte-185etb5");
    			add_location(div0, file$g, 34, 6, 1508);
    			attr_dev(div1, "id", "cost");
    			attr_dev(div1, "class", "svelte-185etb5");
    			add_location(div1, file$g, 37, 6, 1560);
    			set_style(div2, "display", "grid");
    			set_style(div2, "grid-template-rows", "auto 14px");
    			set_style(div2, "height", "100%");
    			add_location(div2, file$g, 33, 4, 1430);
    			attr_dev(div3, "id", "boughtContainer");
    			attr_dev(div3, "class", "svelte-185etb5");
    			add_location(div3, file$g, 45, 4, 1719);
    			attr_dev(button, "class", "svelte-185etb5");
    			toggle_class(button, "disabled", !/*$canAfford*/ ctx[3]);
    			toggle_class(button, "maxed", /*$isMaxed*/ ctx[4]);
    			add_location(button, file$g, 26, 2, 1237);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, div2);
    			append_dev(div2, div0);

    			if (default_slot) {
    				default_slot.m(div0, null);
    			}

    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			if (if_block0) if_block0.m(div1, null);
    			append_dev(button, t1);
    			append_dev(button, div3);
    			if_block1.m(div3, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button, "click", /*handleUpgradeClicked*/ ctx[14], false, false, false),
    					action_destroyer(tooltip_action = tooltip.call(null, button, { data: /*tooltipText*/ ctx[0] }))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 131072)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[17],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[17])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[17], dirty, null),
    						null
    					);
    				}
    			}

    			if (!/*$isMaxed*/ ctx[4]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_3$4(ctx);
    					if_block0.c();
    					if_block0.m(div1, null);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block1) {
    				if_block1.p(ctx, dirty);
    			} else {
    				if_block1.d(1);
    				if_block1 = current_block_type(ctx);

    				if (if_block1) {
    					if_block1.c();
    					if_block1.m(div3, null);
    				}
    			}

    			if (tooltip_action && is_function(tooltip_action.update) && dirty & /*tooltipText*/ 1) tooltip_action.update.call(null, { data: /*tooltipText*/ ctx[0] });

    			if (dirty & /*$canAfford*/ 8) {
    				toggle_class(button, "disabled", !/*$canAfford*/ ctx[3]);
    			}

    			if (dirty & /*$isMaxed*/ 16) {
    				toggle_class(button, "maxed", /*$isMaxed*/ ctx[4]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);

    			add_render_callback(() => {
    				if (!button_transition) button_transition = create_bidirectional_transition(button, fade, { duration: 1000 }, true);
    				button_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			if (!button_transition) button_transition = create_bidirectional_transition(button, fade, { duration: 1000 }, false);
    			button_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (default_slot) default_slot.d(detaching);
    			if (if_block0) if_block0.d();
    			if_block1.d();
    			if (detaching && button_transition) button_transition.end();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$9.name,
    		type: "if",
    		source: "(26:0) {#if btnUnlocked || $LORCA_OVERRIDE}",
    		ctx
    	});

    	return block;
    }

    // (39:8) {#if !$isMaxed}
    function create_if_block_3$4(ctx) {
    	let t0_value = formatWhole(/*$cost*/ ctx[5]) + "";
    	let t0;
    	let t1;
    	let t2_value = formatResourceName(/*resourceName*/ ctx[8]) + "";
    	let t2;

    	const block = {
    		c: function create() {
    			t0 = text(t0_value);
    			t1 = space();
    			t2 = text(t2_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, t2, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$cost*/ 32 && t0_value !== (t0_value = formatWhole(/*$cost*/ ctx[5]) + "")) set_data_dev(t0, t0_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(t2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$4.name,
    		type: "if",
    		source: "(39:8) {#if !$isMaxed}",
    		ctx
    	});

    	return block;
    }

    // (53:6) {:else}
    function create_else_block_1$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*$upgradesBought*/ ctx[7]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$upgradesBought*/ 128) set_data_dev(t, /*$upgradesBought*/ ctx[7]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1$2.name,
    		type: "else",
    		source: "(53:6) {:else}",
    		ctx
    	});

    	return block;
    }

    // (47:6) {#if $maxBuy !== null}
    function create_if_block_1$7(ctx) {
    	let if_block_anchor;

    	function select_block_type_2(ctx, dirty) {
    		if (/*$isMaxed*/ ctx[4]) return create_if_block_2$6;
    		return create_else_block$4;
    	}

    	let current_block_type = select_block_type_2(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_2(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$7.name,
    		type: "if",
    		source: "(47:6) {#if $maxBuy !== null}",
    		ctx
    	});

    	return block;
    }

    // (50:8) {:else}
    function create_else_block$4(ctx) {
    	let t0;
    	let t1;
    	let t2;

    	const block = {
    		c: function create() {
    			t0 = text(/*$upgradesBought*/ ctx[7]);
    			t1 = text("/");
    			t2 = text(/*$maxBuy*/ ctx[6]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, t2, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$upgradesBought*/ 128) set_data_dev(t0, /*$upgradesBought*/ ctx[7]);
    			if (dirty & /*$maxBuy*/ 64) set_data_dev(t2, /*$maxBuy*/ ctx[6]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(t2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$4.name,
    		type: "else",
    		source: "(50:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (48:8) {#if $isMaxed}
    function create_if_block_2$6(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("MAX");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$6.name,
    		type: "if",
    		source: "(48:8) {#if $isMaxed}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$g(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$9, create_else_block_2$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*btnUnlocked*/ ctx[1] || /*$LORCA_OVERRIDE*/ ctx[2]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let $LORCA_OVERRIDE;
    	let $canAfford;
    	let $isMaxed;
    	let $cost;
    	let $maxBuy;
    	let $upgradesBought;
    	validate_store(LORCA_OVERRIDE, 'LORCA_OVERRIDE');
    	component_subscribe($$self, LORCA_OVERRIDE, $$value => $$invalidate(2, $LORCA_OVERRIDE = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('UpgradeButton', slots, ['default']);
    	let { upgradeName } = $$props;
    	let { tooltipText = null } = $$props;
    	let { buyMaxUpgrades = false } = $$props;
    	let { btnUnlocked = true } = $$props;
    	const resourceName = get_store_value(upgrades)[upgradeName].resource;
    	const cost = derived(upgrades, $upgrades => $upgrades[upgradeName].cost);
    	validate_store(cost, 'cost');
    	component_subscribe($$self, cost, value => $$invalidate(5, $cost = value));
    	const canAfford = derived(resource, $resource => $resource[resourceName] >= get_store_value(cost));
    	validate_store(canAfford, 'canAfford');
    	component_subscribe($$self, canAfford, value => $$invalidate(3, $canAfford = value));
    	const maxBuy = derived(upgrades, $upgrades => $upgrades[upgradeName].maxBuy);
    	validate_store(maxBuy, 'maxBuy');
    	component_subscribe($$self, maxBuy, value => $$invalidate(6, $maxBuy = value));

    	const isMaxed = derived(upgrades, $upgrades => {
    		const maxBuy = $upgrades[upgradeName].maxBuy;
    		return maxBuy !== null && $upgrades[upgradeName].bought >= maxBuy;
    	});

    	validate_store(isMaxed, 'isMaxed');
    	component_subscribe($$self, isMaxed, value => $$invalidate(4, $isMaxed = value));
    	const upgradesBought = derived(upgrades, $upgrades => $upgrades[upgradeName].bought);
    	validate_store(upgradesBought, 'upgradesBought');
    	component_subscribe($$self, upgradesBought, value => $$invalidate(7, $upgradesBought = value));

    	// beforeUpdate(() => console.log('beforeUpdate'))
    	function handleUpgradeClicked() {
    		buyUpgrade(upgrades)(upgradeName, buyMaxUpgrades);
    	}

    	const writable_props = ['upgradeName', 'tooltipText', 'buyMaxUpgrades', 'btnUnlocked'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<UpgradeButton> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('upgradeName' in $$props) $$invalidate(15, upgradeName = $$props.upgradeName);
    		if ('tooltipText' in $$props) $$invalidate(0, tooltipText = $$props.tooltipText);
    		if ('buyMaxUpgrades' in $$props) $$invalidate(16, buyMaxUpgrades = $$props.buyMaxUpgrades);
    		if ('btnUnlocked' in $$props) $$invalidate(1, btnUnlocked = $$props.btnUnlocked);
    		if ('$$scope' in $$props) $$invalidate(17, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		formatWhole,
    		formatResourceName,
    		buyUpgrade,
    		upgrades,
    		resource,
    		LORCA_OVERRIDE,
    		tooltip,
    		derived,
    		get: get_store_value,
    		fade,
    		upgradeName,
    		tooltipText,
    		buyMaxUpgrades,
    		btnUnlocked,
    		resourceName,
    		cost,
    		canAfford,
    		maxBuy,
    		isMaxed,
    		upgradesBought,
    		handleUpgradeClicked,
    		$LORCA_OVERRIDE,
    		$canAfford,
    		$isMaxed,
    		$cost,
    		$maxBuy,
    		$upgradesBought
    	});

    	$$self.$inject_state = $$props => {
    		if ('upgradeName' in $$props) $$invalidate(15, upgradeName = $$props.upgradeName);
    		if ('tooltipText' in $$props) $$invalidate(0, tooltipText = $$props.tooltipText);
    		if ('buyMaxUpgrades' in $$props) $$invalidate(16, buyMaxUpgrades = $$props.buyMaxUpgrades);
    		if ('btnUnlocked' in $$props) $$invalidate(1, btnUnlocked = $$props.btnUnlocked);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		tooltipText,
    		btnUnlocked,
    		$LORCA_OVERRIDE,
    		$canAfford,
    		$isMaxed,
    		$cost,
    		$maxBuy,
    		$upgradesBought,
    		resourceName,
    		cost,
    		canAfford,
    		maxBuy,
    		isMaxed,
    		upgradesBought,
    		handleUpgradeClicked,
    		upgradeName,
    		buyMaxUpgrades,
    		$$scope,
    		slots
    	];
    }

    class UpgradeButton extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$g, create_fragment$g, safe_not_equal, {
    			upgradeName: 15,
    			tooltipText: 0,
    			buyMaxUpgrades: 16,
    			btnUnlocked: 1
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "UpgradeButton",
    			options,
    			id: create_fragment$g.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*upgradeName*/ ctx[15] === undefined && !('upgradeName' in props)) {
    			console.warn("<UpgradeButton> was created without expected prop 'upgradeName'");
    		}
    	}

    	get upgradeName() {
    		throw new Error("<UpgradeButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set upgradeName(value) {
    		throw new Error("<UpgradeButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tooltipText() {
    		throw new Error("<UpgradeButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tooltipText(value) {
    		throw new Error("<UpgradeButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get buyMaxUpgrades() {
    		throw new Error("<UpgradeButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set buyMaxUpgrades(value) {
    		throw new Error("<UpgradeButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get btnUnlocked() {
    		throw new Error("<UpgradeButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set btnUnlocked(value) {
    		throw new Error("<UpgradeButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/EffectComponent.svelte generated by Svelte v3.44.1 */

    const file$f = "src/components/EffectComponent.svelte";

    function create_fragment$f(ctx) {
    	let div2;
    	let div0;
    	let span;
    	let t0;
    	let t1;
    	let hr;
    	let t2;
    	let div1;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			span = element("span");
    			t0 = text(/*title*/ ctx[0]);
    			t1 = space();
    			hr = element("hr");
    			t2 = space();
    			div1 = element("div");
    			if (default_slot) default_slot.c();
    			set_style(span, "text-align", "center");
    			add_location(span, file$f, 5, 4, 137);
    			attr_dev(hr, "class", "svelte-oj12gi");
    			add_location(hr, file$f, 6, 4, 188);
    			attr_dev(div0, "id", "effectHeader");
    			attr_dev(div0, "class", "svelte-oj12gi");
    			add_location(div0, file$f, 4, 2, 109);
    			attr_dev(div1, "id", "effectBody");
    			attr_dev(div1, "class", "svelte-oj12gi");
    			add_location(div1, file$f, 8, 2, 206);
    			attr_dev(div2, "id", "effectContainer");
    			attr_dev(div2, "class", "theme-border svelte-oj12gi");
    			add_location(div2, file$f, 3, 0, 59);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, span);
    			append_dev(span, t0);
    			append_dev(div0, t1);
    			append_dev(div0, hr);
    			append_dev(div2, t2);
    			append_dev(div2, div1);

    			if (default_slot) {
    				default_slot.m(div1, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*title*/ 1) set_data_dev(t0, /*title*/ ctx[0]);

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[1],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[1])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[1], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('EffectComponent', slots, ['default']);
    	let { title = 'Effects' } = $$props;
    	const writable_props = ['title'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<EffectComponent> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('$$scope' in $$props) $$invalidate(1, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ title });

    	$$self.$inject_state = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [title, $$scope, slots];
    }

    class EffectComponent extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, { title: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "EffectComponent",
    			options,
    			id: create_fragment$f.name
    		});
    	}

    	get title() {
    		throw new Error("<EffectComponent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<EffectComponent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Effect.svelte generated by Svelte v3.44.1 */
    const file$e = "src/components/Effect.svelte";

    // (9:0) {#if unlocked}
    function create_if_block$8(ctx) {
    	let span1;
    	let t0;
    	let span0;
    	let t1_value = formatNumber(/*factor*/ ctx[0], 2) + "";
    	let t1;
    	let t2;
    	let t3;
    	let tooltip_action;
    	let span1_transition;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);
    	const default_slot_or_fallback = default_slot || fallback_block(ctx);

    	const block = {
    		c: function create() {
    			span1 = element("span");
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			t0 = text("\n    [");
    			span0 = element("span");
    			t1 = text(t1_value);
    			t2 = text("x");
    			t3 = text("]");
    			set_style(span0, "color", "var(--themeColor2)");
    			add_location(span0, file$e, 16, 5, 455);
    			attr_dev(span1, "class", "effect svelte-1j3t7dm");
    			toggle_class(span1, "bg-on-hover", /*tooltipText*/ ctx[2] !== null);
    			add_location(span1, file$e, 9, 2, 263);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span1, anchor);

    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(span1, null);
    			}

    			append_dev(span1, t0);
    			append_dev(span1, span0);
    			append_dev(span0, t1);
    			append_dev(span0, t2);
    			append_dev(span1, t3);
    			current = true;

    			if (!mounted) {
    				dispose = action_destroyer(tooltip_action = tooltip.call(null, span1, { data: /*tooltipText*/ ctx[2] }));
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 8)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[3],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[3])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[3], dirty, null),
    						null
    					);
    				}
    			}

    			if ((!current || dirty & /*factor*/ 1) && t1_value !== (t1_value = formatNumber(/*factor*/ ctx[0], 2) + "")) set_data_dev(t1, t1_value);
    			if (tooltip_action && is_function(tooltip_action.update) && dirty & /*tooltipText*/ 4) tooltip_action.update.call(null, { data: /*tooltipText*/ ctx[2] });

    			if (dirty & /*tooltipText*/ 4) {
    				toggle_class(span1, "bg-on-hover", /*tooltipText*/ ctx[2] !== null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);

    			add_render_callback(() => {
    				if (!span1_transition) span1_transition = create_bidirectional_transition(span1, fade, { duration: 1000 }, true);
    				span1_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			if (!span1_transition) span1_transition = create_bidirectional_transition(span1, fade, { duration: 1000 }, false);
    			span1_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span1);
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    			if (detaching && span1_transition) span1_transition.end();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(9:0) {#if unlocked}",
    		ctx
    	});

    	return block;
    }

    // (16:10) No Description
    function fallback_block(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("No Description");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block.name,
    		type: "fallback",
    		source: "(16:10) No Description",
    		ctx
    	});

    	return block;
    }

    function create_fragment$e(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*unlocked*/ ctx[1] && create_if_block$8(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*unlocked*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*unlocked*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$8(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Effect', slots, ['default']);
    	let { factor } = $$props;
    	let { unlocked = true } = $$props;
    	let { tooltipText = null } = $$props;
    	const writable_props = ['factor', 'unlocked', 'tooltipText'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Effect> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('factor' in $$props) $$invalidate(0, factor = $$props.factor);
    		if ('unlocked' in $$props) $$invalidate(1, unlocked = $$props.unlocked);
    		if ('tooltipText' in $$props) $$invalidate(2, tooltipText = $$props.tooltipText);
    		if ('$$scope' in $$props) $$invalidate(3, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		formatNumber,
    		fade,
    		tooltip,
    		factor,
    		unlocked,
    		tooltipText
    	});

    	$$self.$inject_state = $$props => {
    		if ('factor' in $$props) $$invalidate(0, factor = $$props.factor);
    		if ('unlocked' in $$props) $$invalidate(1, unlocked = $$props.unlocked);
    		if ('tooltipText' in $$props) $$invalidate(2, tooltipText = $$props.tooltipText);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [factor, unlocked, tooltipText, $$scope, slots];
    }

    class Effect extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, { factor: 0, unlocked: 1, tooltipText: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Effect",
    			options,
    			id: create_fragment$e.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*factor*/ ctx[0] === undefined && !('factor' in props)) {
    			console.warn("<Effect> was created without expected prop 'factor'");
    		}
    	}

    	get factor() {
    		throw new Error("<Effect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set factor(value) {
    		throw new Error("<Effect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get unlocked() {
    		throw new Error("<Effect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set unlocked(value) {
    		throw new Error("<Effect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tooltipText() {
    		throw new Error("<Effect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tooltipText(value) {
    		throw new Error("<Effect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/game-windows/ThoughtComponent.svelte generated by Svelte v3.44.1 */
    const file$d = "src/components/game-windows/ThoughtComponent.svelte";

    // (83:6) {#if $unlocked.thinkPassively || LORCA_OVERRIDE}
    function create_if_block_1$6(ctx) {
    	let span;
    	let t0_value = formatNumber(/*$thoughtsPerSec*/ ctx[0], 2) + "";
    	let t0;
    	let t1;
    	let t2;
    	let if_block_anchor;
    	let if_block = /*$currentThoughtBoost*/ ctx[6] > 1 && create_if_block_2$5(ctx);

    	const block = {
    		c: function create() {
    			span = element("span");
    			t0 = text(t0_value);
    			t1 = text("/s");
    			t2 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			attr_dev(span, "class", "svelte-d0pcjz");
    			toggle_class(span, "green", /*$currentThoughtBoost*/ ctx[6] > 1);
    			add_location(span, file$d, 83, 8, 3563);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t0);
    			append_dev(span, t1);
    			insert_dev(target, t2, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$thoughtsPerSec*/ 1 && t0_value !== (t0_value = formatNumber(/*$thoughtsPerSec*/ ctx[0], 2) + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*$currentThoughtBoost*/ 64) {
    				toggle_class(span, "green", /*$currentThoughtBoost*/ ctx[6] > 1);
    			}

    			if (/*$currentThoughtBoost*/ ctx[6] > 1) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_2$5(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (detaching) detach_dev(t2);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$6.name,
    		type: "if",
    		source: "(83:6) {#if $unlocked.thinkPassively || LORCA_OVERRIDE}",
    		ctx
    	});

    	return block;
    }

    // (85:8) {#if $currentThoughtBoost > 1}
    function create_if_block_2$5(ctx) {
    	let t0;
    	let t1_value = formatNumber(/*$currentThoughtBoost*/ ctx[6], 2) + "";
    	let t1;
    	let t2;
    	let if_block_anchor;
    	let if_block = /*$currentThoughtBoostTime*/ ctx[8] >= 100 && create_if_block_3$3(ctx);

    	const block = {
    		c: function create() {
    			t0 = text("- ");
    			t1 = text(t1_value);
    			t2 = text("x\r\n          ");
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, t2, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$currentThoughtBoost*/ 64 && t1_value !== (t1_value = formatNumber(/*$currentThoughtBoost*/ ctx[6], 2) + "")) set_data_dev(t1, t1_value);

    			if (/*$currentThoughtBoostTime*/ ctx[8] >= 100) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_3$3(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(t2);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$5.name,
    		type: "if",
    		source: "(85:8) {#if $currentThoughtBoost > 1}",
    		ctx
    	});

    	return block;
    }

    // (87:10) {#if $currentThoughtBoostTime >= 100}
    function create_if_block_3$3(ctx) {
    	let t0;
    	let t1_value = formatTime(/*$currentThoughtBoostTime*/ ctx[8] / 1000, 1) + "";
    	let t1;
    	let t2;
    	let if_block_anchor;
    	let if_block = /*$unlocked*/ ctx[11].thoughtBoostStack && create_if_block_4$2(ctx);

    	const block = {
    		c: function create() {
    			t0 = text("for ");
    			t1 = text(t1_value);
    			t2 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, t2, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$currentThoughtBoostTime*/ 256 && t1_value !== (t1_value = formatTime(/*$currentThoughtBoostTime*/ ctx[8] / 1000, 1) + "")) set_data_dev(t1, t1_value);

    			if (/*$unlocked*/ ctx[11].thoughtBoostStack) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_4$2(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(t2);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$3.name,
    		type: "if",
    		source: "(87:10) {#if $currentThoughtBoostTime >= 100}",
    		ctx
    	});

    	return block;
    }

    // (89:12) {#if $unlocked.thoughtBoostStack}
    function create_if_block_4$2(ctx) {
    	let t0;
    	let t1;
    	let t2;
    	let t3;
    	let t4;
    	let t5_value = (/*$thoughtBoostMaxStacks*/ ctx[10] > 1 ? 's' : '') + "";
    	let t5;

    	const block = {
    		c: function create() {
    			t0 = text("- ");
    			t1 = text(/*thoughtBoostCurrentStacks*/ ctx[3]);
    			t2 = text("/");
    			t3 = text(/*$thoughtBoostMaxStacks*/ ctx[10]);
    			t4 = text(" Stack");
    			t5 = text(t5_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, t5, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*thoughtBoostCurrentStacks*/ 8) set_data_dev(t1, /*thoughtBoostCurrentStacks*/ ctx[3]);
    			if (dirty & /*$thoughtBoostMaxStacks*/ 1024) set_data_dev(t3, /*$thoughtBoostMaxStacks*/ ctx[10]);
    			if (dirty & /*$thoughtBoostMaxStacks*/ 1024 && t5_value !== (t5_value = (/*$thoughtBoostMaxStacks*/ ctx[10] > 1 ? 's' : '') + "")) set_data_dev(t5, t5_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(t5);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$2.name,
    		type: "if",
    		source: "(89:12) {#if $unlocked.thoughtBoostStack}",
    		ctx
    	});

    	return block;
    }

    // (104:4) {:else}
    function create_else_block$3(ctx) {
    	let button;
    	let t0;
    	let br;
    	let t1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			t0 = text("Think ");
    			br = element("br");
    			t1 = text("\r\n        (+1 thought)");
    			add_location(br, file$d, 105, 14, 4497);
    			add_location(button, file$d, 104, 6, 4450);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t0);
    			append_dev(button, br);
    			append_dev(button, t1);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*handleThink*/ ctx[13], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(104:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (99:4) {#if $unlocked.thoughtBoost}
    function create_if_block$7(ctx) {
    	let button;
    	let t0;
    	let span;
    	let br;
    	let t1;
    	let t2_value = formatNumber(/*$thoughtBoostMax*/ ctx[7], 2) + "";
    	let t2;
    	let t3;
    	let t4_value = formatTime(/*$thoughtBoostDuration*/ ctx[9] / 1000) + "";
    	let t4;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			t0 = text("Thought Boost ");
    			span = element("span");
    			br = element("br");
    			t1 = text("\r\n        x");
    			t2 = text(t2_value);
    			t3 = text(" thoughts/s for ");
    			t4 = text(t4_value);
    			attr_dev(span, "class", "iconify");
    			attr_dev(span, "data-icon", "icon-park-outline:brain");
    			add_location(span, file$d, 100, 22, 4242);
    			add_location(br, file$d, 100, 82, 4302);
    			add_location(button, file$d, 99, 6, 4187);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t0);
    			append_dev(button, span);
    			append_dev(button, br);
    			append_dev(button, t1);
    			append_dev(button, t2);
    			append_dev(button, t3);
    			append_dev(button, t4);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*handleThink*/ ctx[13], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$thoughtBoostMax*/ 128 && t2_value !== (t2_value = formatNumber(/*$thoughtBoostMax*/ ctx[7], 2) + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*$thoughtBoostDuration*/ 512 && t4_value !== (t4_value = formatTime(/*$thoughtBoostDuration*/ ctx[9] / 1000) + "")) set_data_dev(t4, t4_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(99:4) {#if $unlocked.thoughtBoost}",
    		ctx
    	});

    	return block;
    }

    // (116:6) <UpgradeButton          upgradeName="thoughtAcceleration"          {buyMaxUpgrades}          btnUnlocked={$unlocked.thinkFaster}          tooltipText={`+${formatNumber(thoughtAccelDisplay, 2)} thought${thoughtAccelDisplay > 1 ? 's' : ''}/s`}        >
    function create_default_slot_7$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Thought Acceleration");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7$3.name,
    		type: "slot",
    		source: "(116:6) <UpgradeButton          upgradeName=\\\"thoughtAcceleration\\\"          {buyMaxUpgrades}          btnUnlocked={$unlocked.thinkFaster}          tooltipText={`+${formatNumber(thoughtAccelDisplay, 2)} thought${thoughtAccelDisplay > 1 ? 's' : ''}/s`}        >",
    		ctx
    	});

    	return block;
    }

    // (125:6) <UpgradeButton          upgradeName="thoughtJerk"          {buyMaxUpgrades}          btnUnlocked={$unlocked.thoughtJerk}          tooltipText={`+${formatNumber(thoughtJerkDisplay, 2)} to Effect of Thought Acceleration `}        >
    function create_default_slot_6$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Thought Jerk");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6$3.name,
    		type: "slot",
    		source: "(125:6) <UpgradeButton          upgradeName=\\\"thoughtJerk\\\"          {buyMaxUpgrades}          btnUnlocked={$unlocked.thoughtJerk}          tooltipText={`+${formatNumber(thoughtJerkDisplay, 2)} to Effect of Thought Acceleration `}        >",
    		ctx
    	});

    	return block;
    }

    // (134:6) <UpgradeButton          upgradeName="thoughtBoostStrength"          {buyMaxUpgrades}          btnUnlocked={$unlocked.thoughtBoost}          tooltipText="Scales ^1.5 with #upgrades"        >
    function create_default_slot_5$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Increase the strength of Thought Boosts");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5$3.name,
    		type: "slot",
    		source: "(134:6) <UpgradeButton          upgradeName=\\\"thoughtBoostStrength\\\"          {buyMaxUpgrades}          btnUnlocked={$unlocked.thoughtBoost}          tooltipText=\\\"Scales ^1.5 with #upgrades\\\"        >",
    		ctx
    	});

    	return block;
    }

    // (143:6) <UpgradeButton          upgradeName="thoughtBoostDuration"          {buyMaxUpgrades}          btnUnlocked={$unlocked.thoughtBoost}          tooltipText="Duration +5s"        >
    function create_default_slot_4$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Increase the duration of Thought Boosts");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$3.name,
    		type: "slot",
    		source: "(143:6) <UpgradeButton          upgradeName=\\\"thoughtBoostDuration\\\"          {buyMaxUpgrades}          btnUnlocked={$unlocked.thoughtBoost}          tooltipText=\\\"Duration +5s\\\"        >",
    		ctx
    	});

    	return block;
    }

    // (152:6) <UpgradeButton          upgradeName="thoughtBoostStack"          {buyMaxUpgrades}          btnUnlocked={$unlocked.thoughtBoostStack}          tooltipText="Max stacks +1"        >
    function create_default_slot_3$3(ctx) {
    	let t;
    	let br;

    	const block = {
    		c: function create() {
    			t = text("Increase the maximum stack size of Thought Boosts ");
    			br = element("br");
    			add_location(br, file$d, 157, 58, 6093);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    			insert_dev(target, br, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(br);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$3.name,
    		type: "slot",
    		source: "(152:6) <UpgradeButton          upgradeName=\\\"thoughtBoostStack\\\"          {buyMaxUpgrades}          btnUnlocked={$unlocked.thoughtBoostStack}          tooltipText=\\\"Max stacks +1\\\"        >",
    		ctx
    	});

    	return block;
    }

    // (166:8) <Effect factor={$currentThoughtBoost} unlocked={$unlocked.cheeseBoost}>
    function create_default_slot_2$3(ctx) {
    	let t_value = unlocks.cheese.find(/*func*/ ctx[18])?.description + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$3.name,
    		type: "slot",
    		source: "(166:8) <Effect factor={$currentThoughtBoost} unlocked={$unlocked.cheeseBoost}>",
    		ctx
    	});

    	return block;
    }

    // (163:6) <EffectComponent          title={$upgrades.cheeseThoughtMult.bought > 0 || $unlocked.cheeseQueueLengthBoost ? 'Effects' : '???'}        >
    function create_default_slot_1$3(ctx) {
    	let effect;
    	let current;

    	effect = new Effect({
    			props: {
    				factor: /*$currentThoughtBoost*/ ctx[6],
    				unlocked: /*$unlocked*/ ctx[11].cheeseBoost,
    				$$slots: { default: [create_default_slot_2$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(effect.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(effect, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const effect_changes = {};
    			if (dirty & /*$currentThoughtBoost*/ 64) effect_changes.factor = /*$currentThoughtBoost*/ ctx[6];
    			if (dirty & /*$unlocked*/ 2048) effect_changes.unlocked = /*$unlocked*/ ctx[11].cheeseBoost;

    			if (dirty & /*$$scope*/ 4194304) {
    				effect_changes.$$scope = { dirty, ctx };
    			}

    			effect.$set(effect_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(effect.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(effect.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(effect, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$3.name,
    		type: "slot",
    		source: "(163:6) <EffectComponent          title={$upgrades.cheeseThoughtMult.bought > 0 || $unlocked.cheeseQueueLengthBoost ? 'Effects' : '???'}        >",
    		ctx
    	});

    	return block;
    }

    // (71:0) <Window title="Cogito Ergo Sum" themeColor1="rgb(129, 0, 204)" themeColor2="rgb(182, 122, 255)">
    function create_default_slot$5(ctx) {
    	let div0;
    	let input;
    	let t0;
    	let label;
    	let t2;
    	let div1;
    	let span1;
    	let t3;
    	let span0;
    	let t5;
    	let t6_value = formatNumber(/*$resource*/ ctx[12].thoughts, 2) + "";
    	let t6;
    	let t7;
    	let br;
    	let t8;
    	let span2;
    	let t9;
    	let div2;
    	let t10;
    	let unlockdrawer;
    	let t11;
    	let div5;
    	let div3;
    	let upgradebutton0;
    	let t12;
    	let upgradebutton1;
    	let t13;
    	let upgradebutton2;
    	let t14;
    	let upgradebutton3;
    	let t15;
    	let upgradebutton4;
    	let t16;
    	let div4;
    	let effectcomponent;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = (/*$unlocked*/ ctx[11].thinkPassively || LORCA_OVERRIDE) && create_if_block_1$6(ctx);

    	function select_block_type(ctx, dirty) {
    		if (/*$unlocked*/ ctx[11].thoughtBoost) return create_if_block$7;
    		return create_else_block$3;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block1 = current_block_type(ctx);

    	unlockdrawer = new UnlockDrawer({
    			props: {
    				unlocks: unlocks.thoughts,
    				folderName: "Swordsman_Skill_Icons_Pack"
    			},
    			$$inline: true
    		});

    	upgradebutton0 = new UpgradeButton({
    			props: {
    				upgradeName: "thoughtAcceleration",
    				buyMaxUpgrades: /*buyMaxUpgrades*/ ctx[2],
    				btnUnlocked: /*$unlocked*/ ctx[11].thinkFaster,
    				tooltipText: `+${formatNumber(/*thoughtAccelDisplay*/ ctx[5], 2)} thought${/*thoughtAccelDisplay*/ ctx[5] > 1 ? 's' : ''}/s`,
    				$$slots: { default: [create_default_slot_7$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	upgradebutton1 = new UpgradeButton({
    			props: {
    				upgradeName: "thoughtJerk",
    				buyMaxUpgrades: /*buyMaxUpgrades*/ ctx[2],
    				btnUnlocked: /*$unlocked*/ ctx[11].thoughtJerk,
    				tooltipText: `+${formatNumber(/*thoughtJerkDisplay*/ ctx[4], 2)} to Effect of Thought Acceleration `,
    				$$slots: { default: [create_default_slot_6$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	upgradebutton2 = new UpgradeButton({
    			props: {
    				upgradeName: "thoughtBoostStrength",
    				buyMaxUpgrades: /*buyMaxUpgrades*/ ctx[2],
    				btnUnlocked: /*$unlocked*/ ctx[11].thoughtBoost,
    				tooltipText: "Scales ^1.5 with #upgrades",
    				$$slots: { default: [create_default_slot_5$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	upgradebutton3 = new UpgradeButton({
    			props: {
    				upgradeName: "thoughtBoostDuration",
    				buyMaxUpgrades: /*buyMaxUpgrades*/ ctx[2],
    				btnUnlocked: /*$unlocked*/ ctx[11].thoughtBoost,
    				tooltipText: "Duration +5s",
    				$$slots: { default: [create_default_slot_4$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	upgradebutton4 = new UpgradeButton({
    			props: {
    				upgradeName: "thoughtBoostStack",
    				buyMaxUpgrades: /*buyMaxUpgrades*/ ctx[2],
    				btnUnlocked: /*$unlocked*/ ctx[11].thoughtBoostStack,
    				tooltipText: "Max stacks +1",
    				$$slots: { default: [create_default_slot_3$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	effectcomponent = new EffectComponent({
    			props: {
    				title: /*$upgrades*/ ctx[1].cheeseThoughtMult.bought > 0 || /*$unlocked*/ ctx[11].cheeseQueueLengthBoost
    				? 'Effects'
    				: '???',
    				$$slots: { default: [create_default_slot_1$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			input = element("input");
    			t0 = space();
    			label = element("label");
    			label.textContent = "Buy Max";
    			t2 = space();
    			div1 = element("div");
    			span1 = element("span");
    			t3 = text("You ");
    			span0 = element("span");
    			span0.textContent = "thought";
    			t5 = space();
    			t6 = text(t6_value);
    			t7 = text(" times");
    			br = element("br");
    			t8 = space();
    			span2 = element("span");
    			if (if_block0) if_block0.c();
    			t9 = space();
    			div2 = element("div");
    			if_block1.c();
    			t10 = space();
    			create_component(unlockdrawer.$$.fragment);
    			t11 = space();
    			div5 = element("div");
    			div3 = element("div");
    			create_component(upgradebutton0.$$.fragment);
    			t12 = space();
    			create_component(upgradebutton1.$$.fragment);
    			t13 = space();
    			create_component(upgradebutton2.$$.fragment);
    			t14 = space();
    			create_component(upgradebutton3.$$.fragment);
    			t15 = space();
    			create_component(upgradebutton4.$$.fragment);
    			t16 = space();
    			div4 = element("div");
    			create_component(effectcomponent.$$.fragment);
    			attr_dev(input, "type", "checkbox");
    			attr_dev(input, "name", "buyMax");
    			add_location(input, file$d, 72, 4, 3165);
    			attr_dev(label, "for", "buyMax");
    			add_location(label, file$d, 73, 4, 3240);
    			set_style(div0, "position", "absolute");
    			set_style(div0, "right", "8px");
    			set_style(div0, "top", "8px");
    			add_location(div0, file$d, 71, 2, 3104);
    			set_style(span0, "color", "var(--themeColor2)");
    			set_style(span0, "font-weight", "bold");
    			add_location(span0, file$d, 78, 10, 3344);
    			add_location(br, file$d, 79, 49, 3466);
    			attr_dev(span1, "class", "resourceDisplay");
    			add_location(span1, file$d, 77, 4, 3302);
    			add_location(span2, file$d, 81, 4, 3491);
    			add_location(div1, file$d, 76, 2, 3291);
    			attr_dev(div2, "class", "flexRowContainer");
    			add_location(div2, file$d, 97, 2, 4115);
    			attr_dev(div3, "class", "gridColumn");
    			add_location(div3, file$d, 114, 4, 4694);
    			attr_dev(div4, "class", "gridColumn");
    			set_style(div4, "height", "332px");
    			set_style(div4, "width", "100%");
    			add_location(div4, file$d, 161, 4, 6143);
    			attr_dev(div5, "class", "flexRowContainer");
    			add_location(div5, file$d, 113, 2, 4658);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, input);
    			input.checked = /*buyMaxUpgrades*/ ctx[2];
    			append_dev(div0, t0);
    			append_dev(div0, label);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, span1);
    			append_dev(span1, t3);
    			append_dev(span1, span0);
    			append_dev(span1, t5);
    			append_dev(span1, t6);
    			append_dev(span1, t7);
    			append_dev(span1, br);
    			append_dev(div1, t8);
    			append_dev(div1, span2);
    			if (if_block0) if_block0.m(span2, null);
    			insert_dev(target, t9, anchor);
    			insert_dev(target, div2, anchor);
    			if_block1.m(div2, null);
    			insert_dev(target, t10, anchor);
    			mount_component(unlockdrawer, target, anchor);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div3);
    			mount_component(upgradebutton0, div3, null);
    			append_dev(div3, t12);
    			mount_component(upgradebutton1, div3, null);
    			append_dev(div3, t13);
    			mount_component(upgradebutton2, div3, null);
    			append_dev(div3, t14);
    			mount_component(upgradebutton3, div3, null);
    			append_dev(div3, t15);
    			mount_component(upgradebutton4, div3, null);
    			append_dev(div5, t16);
    			append_dev(div5, div4);
    			mount_component(effectcomponent, div4, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(input, "change", /*input_change_handler*/ ctx[17]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*buyMaxUpgrades*/ 4) {
    				input.checked = /*buyMaxUpgrades*/ ctx[2];
    			}

    			if ((!current || dirty & /*$resource*/ 4096) && t6_value !== (t6_value = formatNumber(/*$resource*/ ctx[12].thoughts, 2) + "")) set_data_dev(t6, t6_value);

    			if (/*$unlocked*/ ctx[11].thinkPassively || LORCA_OVERRIDE) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_1$6(ctx);
    					if_block0.c();
    					if_block0.m(span2, null);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block1) {
    				if_block1.p(ctx, dirty);
    			} else {
    				if_block1.d(1);
    				if_block1 = current_block_type(ctx);

    				if (if_block1) {
    					if_block1.c();
    					if_block1.m(div2, null);
    				}
    			}

    			const upgradebutton0_changes = {};
    			if (dirty & /*buyMaxUpgrades*/ 4) upgradebutton0_changes.buyMaxUpgrades = /*buyMaxUpgrades*/ ctx[2];
    			if (dirty & /*$unlocked*/ 2048) upgradebutton0_changes.btnUnlocked = /*$unlocked*/ ctx[11].thinkFaster;
    			if (dirty & /*thoughtAccelDisplay*/ 32) upgradebutton0_changes.tooltipText = `+${formatNumber(/*thoughtAccelDisplay*/ ctx[5], 2)} thought${/*thoughtAccelDisplay*/ ctx[5] > 1 ? 's' : ''}/s`;

    			if (dirty & /*$$scope*/ 4194304) {
    				upgradebutton0_changes.$$scope = { dirty, ctx };
    			}

    			upgradebutton0.$set(upgradebutton0_changes);
    			const upgradebutton1_changes = {};
    			if (dirty & /*buyMaxUpgrades*/ 4) upgradebutton1_changes.buyMaxUpgrades = /*buyMaxUpgrades*/ ctx[2];
    			if (dirty & /*$unlocked*/ 2048) upgradebutton1_changes.btnUnlocked = /*$unlocked*/ ctx[11].thoughtJerk;
    			if (dirty & /*thoughtJerkDisplay*/ 16) upgradebutton1_changes.tooltipText = `+${formatNumber(/*thoughtJerkDisplay*/ ctx[4], 2)} to Effect of Thought Acceleration `;

    			if (dirty & /*$$scope*/ 4194304) {
    				upgradebutton1_changes.$$scope = { dirty, ctx };
    			}

    			upgradebutton1.$set(upgradebutton1_changes);
    			const upgradebutton2_changes = {};
    			if (dirty & /*buyMaxUpgrades*/ 4) upgradebutton2_changes.buyMaxUpgrades = /*buyMaxUpgrades*/ ctx[2];
    			if (dirty & /*$unlocked*/ 2048) upgradebutton2_changes.btnUnlocked = /*$unlocked*/ ctx[11].thoughtBoost;

    			if (dirty & /*$$scope*/ 4194304) {
    				upgradebutton2_changes.$$scope = { dirty, ctx };
    			}

    			upgradebutton2.$set(upgradebutton2_changes);
    			const upgradebutton3_changes = {};
    			if (dirty & /*buyMaxUpgrades*/ 4) upgradebutton3_changes.buyMaxUpgrades = /*buyMaxUpgrades*/ ctx[2];
    			if (dirty & /*$unlocked*/ 2048) upgradebutton3_changes.btnUnlocked = /*$unlocked*/ ctx[11].thoughtBoost;

    			if (dirty & /*$$scope*/ 4194304) {
    				upgradebutton3_changes.$$scope = { dirty, ctx };
    			}

    			upgradebutton3.$set(upgradebutton3_changes);
    			const upgradebutton4_changes = {};
    			if (dirty & /*buyMaxUpgrades*/ 4) upgradebutton4_changes.buyMaxUpgrades = /*buyMaxUpgrades*/ ctx[2];
    			if (dirty & /*$unlocked*/ 2048) upgradebutton4_changes.btnUnlocked = /*$unlocked*/ ctx[11].thoughtBoostStack;

    			if (dirty & /*$$scope*/ 4194304) {
    				upgradebutton4_changes.$$scope = { dirty, ctx };
    			}

    			upgradebutton4.$set(upgradebutton4_changes);
    			const effectcomponent_changes = {};

    			if (dirty & /*$upgrades, $unlocked*/ 2050) effectcomponent_changes.title = /*$upgrades*/ ctx[1].cheeseThoughtMult.bought > 0 || /*$unlocked*/ ctx[11].cheeseQueueLengthBoost
    			? 'Effects'
    			: '???';

    			if (dirty & /*$$scope, $currentThoughtBoost, $unlocked*/ 4196416) {
    				effectcomponent_changes.$$scope = { dirty, ctx };
    			}

    			effectcomponent.$set(effectcomponent_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(unlockdrawer.$$.fragment, local);
    			transition_in(upgradebutton0.$$.fragment, local);
    			transition_in(upgradebutton1.$$.fragment, local);
    			transition_in(upgradebutton2.$$.fragment, local);
    			transition_in(upgradebutton3.$$.fragment, local);
    			transition_in(upgradebutton4.$$.fragment, local);
    			transition_in(effectcomponent.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(unlockdrawer.$$.fragment, local);
    			transition_out(upgradebutton0.$$.fragment, local);
    			transition_out(upgradebutton1.$$.fragment, local);
    			transition_out(upgradebutton2.$$.fragment, local);
    			transition_out(upgradebutton3.$$.fragment, local);
    			transition_out(upgradebutton4.$$.fragment, local);
    			transition_out(effectcomponent.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div1);
    			if (if_block0) if_block0.d();
    			if (detaching) detach_dev(t9);
    			if (detaching) detach_dev(div2);
    			if_block1.d();
    			if (detaching) detach_dev(t10);
    			destroy_component(unlockdrawer, detaching);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(div5);
    			destroy_component(upgradebutton0);
    			destroy_component(upgradebutton1);
    			destroy_component(upgradebutton2);
    			destroy_component(upgradebutton3);
    			destroy_component(upgradebutton4);
    			destroy_component(effectcomponent);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$5.name,
    		type: "slot",
    		source: "(71:0) <Window title=\\\"Cogito Ergo Sum\\\" themeColor1=\\\"rgb(129, 0, 204)\\\" themeColor2=\\\"rgb(182, 122, 255)\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let window;
    	let current;

    	window = new Window({
    			props: {
    				title: "Cogito Ergo Sum",
    				themeColor1: "rgb(129, 0, 204)",
    				themeColor2: "rgb(182, 122, 255)",
    				$$slots: { default: [create_default_slot$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(window.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(window, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const window_changes = {};

    			if (dirty & /*$$scope, $upgrades, $unlocked, $currentThoughtBoost, buyMaxUpgrades, thoughtJerkDisplay, thoughtAccelDisplay, $thoughtBoostDuration, $thoughtBoostMax, $thoughtBoostMaxStacks, thoughtBoostCurrentStacks, $currentThoughtBoostTime, $thoughtsPerSec, $resource*/ 4202495) {
    				window_changes.$$scope = { dirty, ctx };
    			}

    			window.$set(window_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(window.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(window.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(window, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const thoughtBoostDecay = 2000;

    function instance$d($$self, $$props, $$invalidate) {
    	let thoughtAccelDisplay;
    	let thoughtJerkDisplay;
    	let $thoughtBoostStrengthBought;
    	let $currentThoughtBoost;
    	let $thoughtBoostMax;
    	let $currentThoughtBoostTime;
    	let $thoughtBoostDuration;
    	let $thoughtBoostMaxStacks;
    	let $unlocked;
    	let $resource;
    	let $thoughtsPerSecBase;
    	let $thoughtsPerSec;
    	let $upgrades;
    	validate_store(currentThoughtBoost, 'currentThoughtBoost');
    	component_subscribe($$self, currentThoughtBoost, $$value => $$invalidate(6, $currentThoughtBoost = $$value));
    	validate_store(thoughtBoostMax, 'thoughtBoostMax');
    	component_subscribe($$self, thoughtBoostMax, $$value => $$invalidate(7, $thoughtBoostMax = $$value));
    	validate_store(currentThoughtBoostTime, 'currentThoughtBoostTime');
    	component_subscribe($$self, currentThoughtBoostTime, $$value => $$invalidate(8, $currentThoughtBoostTime = $$value));
    	validate_store(thoughtBoostDuration, 'thoughtBoostDuration');
    	component_subscribe($$self, thoughtBoostDuration, $$value => $$invalidate(9, $thoughtBoostDuration = $$value));
    	validate_store(thoughtBoostMaxStacks, 'thoughtBoostMaxStacks');
    	component_subscribe($$self, thoughtBoostMaxStacks, $$value => $$invalidate(10, $thoughtBoostMaxStacks = $$value));
    	validate_store(unlocked, 'unlocked');
    	component_subscribe($$self, unlocked, $$value => $$invalidate(11, $unlocked = $$value));
    	validate_store(resource, 'resource');
    	component_subscribe($$self, resource, $$value => $$invalidate(12, $resource = $$value));
    	validate_store(thoughtsPerSecBase, 'thoughtsPerSecBase');
    	component_subscribe($$self, thoughtsPerSecBase, $$value => $$invalidate(16, $thoughtsPerSecBase = $$value));
    	validate_store(thoughtsPerSec, 'thoughtsPerSec');
    	component_subscribe($$self, thoughtsPerSec, $$value => $$invalidate(0, $thoughtsPerSec = $$value));
    	validate_store(upgrades, 'upgrades');
    	component_subscribe($$self, upgrades, $$value => $$invalidate(1, $upgrades = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ThoughtComponent', slots, []);
    	let buyMaxUpgrades = false;
    	let thoughtBoostCurrentStacks = 0;
    	let lastTime = null;
    	let myReq;

    	function handleThink() {
    		if (!$unlocked.thoughtBoost) {
    			set_store_value(resource, $resource.thoughts += 1, $resource);
    			return;
    		}

    		// set multiplier, which expires after a time and starts decaying
    		set_store_value(currentThoughtBoost, $currentThoughtBoost = $thoughtBoostMax, $currentThoughtBoost);

    		if ($unlocked.thoughtBoostStack) {
    			if (thoughtBoostCurrentStacks < $thoughtBoostMaxStacks) {
    				set_store_value(currentThoughtBoostTime, $currentThoughtBoostTime += $thoughtBoostDuration, $currentThoughtBoostTime);
    				$$invalidate(3, thoughtBoostCurrentStacks++, thoughtBoostCurrentStacks);
    			} else set_store_value(currentThoughtBoostTime, $currentThoughtBoostTime = $thoughtBoostDuration * $thoughtBoostMaxStacks, $currentThoughtBoostTime);
    		} else set_store_value(currentThoughtBoostTime, $currentThoughtBoostTime = $thoughtBoostDuration, $currentThoughtBoostTime);

    		cancelAnimationFrame(myReq);
    		myReq = requestAnimationFrame(animateThoughtBoost);
    	}

    	function animateThoughtBoost(currentTime) {
    		if (lastTime === null) lastTime = currentTime;
    		const deltaT = Math.max(Math.min(currentTime - lastTime, 1000), 0);
    		lastTime = currentTime;

    		if ($currentThoughtBoostTime > 0) {
    			set_store_value(currentThoughtBoostTime, $currentThoughtBoostTime -= deltaT, $currentThoughtBoostTime);
    			$$invalidate(3, thoughtBoostCurrentStacks = Math.ceil($currentThoughtBoostTime / $thoughtBoostDuration));
    			if ($currentThoughtBoostTime < 0) set_store_value(currentThoughtBoostTime, $currentThoughtBoostTime = 0, $currentThoughtBoostTime);
    		} else {
    			$$invalidate(3, thoughtBoostCurrentStacks = 0);

    			// decrement evenly over {thoughtBoostDecay} milliseconds
    			set_store_value(currentThoughtBoost, $currentThoughtBoost -= ($thoughtBoostMax - 1) / thoughtBoostDecay * deltaT, $currentThoughtBoost);

    			if ($currentThoughtBoost <= 1) {
    				set_store_value(currentThoughtBoost, $currentThoughtBoost = 1, $currentThoughtBoost);
    			}
    		}

    		if ($currentThoughtBoost > 1) myReq = requestAnimationFrame(animateThoughtBoost);
    	}

    	const thoughtBoostStrengthBought = derived(upgrades, $upgrades => $upgrades.thoughtBoostStrength.bought);
    	validate_store(thoughtBoostStrengthBought, 'thoughtBoostStrengthBought');
    	component_subscribe($$self, thoughtBoostStrengthBought, value => $$invalidate(15, $thoughtBoostStrengthBought = value));

    	onMount(() => {
    		myReq = requestAnimationFrame(animateThoughtBoost);
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ThoughtComponent> was created with unknown prop '${key}'`);
    	});

    	function input_change_handler() {
    		buyMaxUpgrades = this.checked;
    		$$invalidate(2, buyMaxUpgrades);
    	}

    	const func = v => v.name === UnlockName.CHEESE_BOOST;

    	$$self.$capture_state = () => ({
    		Window,
    		UnlockDrawer,
    		formatNumber,
    		formatTime,
    		UpgradeButton,
    		unlocks,
    		LORCA_OVERRIDE,
    		resource,
    		unlocked,
    		upgrades,
    		currentThoughtBoost,
    		currentThoughtBoostTime,
    		thoughtBoostMax,
    		thoughtBoostDuration,
    		thoughtBoostMaxStacks,
    		thoughtsPerSec,
    		thoughtsPerSecBase,
    		UnlockName,
    		onMount,
    		derived,
    		get: get_store_value,
    		EffectComponent,
    		Effect,
    		buyMaxUpgrades,
    		thoughtBoostCurrentStacks,
    		thoughtBoostDecay,
    		lastTime,
    		myReq,
    		handleThink,
    		animateThoughtBoost,
    		thoughtBoostStrengthBought,
    		thoughtJerkDisplay,
    		thoughtAccelDisplay,
    		$thoughtBoostStrengthBought,
    		$currentThoughtBoost,
    		$thoughtBoostMax,
    		$currentThoughtBoostTime,
    		$thoughtBoostDuration,
    		$thoughtBoostMaxStacks,
    		$unlocked,
    		$resource,
    		$thoughtsPerSecBase,
    		$thoughtsPerSec,
    		$upgrades
    	});

    	$$self.$inject_state = $$props => {
    		if ('buyMaxUpgrades' in $$props) $$invalidate(2, buyMaxUpgrades = $$props.buyMaxUpgrades);
    		if ('thoughtBoostCurrentStacks' in $$props) $$invalidate(3, thoughtBoostCurrentStacks = $$props.thoughtBoostCurrentStacks);
    		if ('lastTime' in $$props) lastTime = $$props.lastTime;
    		if ('myReq' in $$props) myReq = $$props.myReq;
    		if ('thoughtJerkDisplay' in $$props) $$invalidate(4, thoughtJerkDisplay = $$props.thoughtJerkDisplay);
    		if ('thoughtAccelDisplay' in $$props) $$invalidate(5, thoughtAccelDisplay = $$props.thoughtAccelDisplay);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$upgrades, $thoughtsPerSec, $thoughtsPerSecBase*/ 65539) {
    			$$invalidate(5, thoughtAccelDisplay = $upgrades.thoughtAcceleration.bought > 0
    			? $thoughtsPerSec / $upgrades.thoughtAcceleration.bought * (1 - 1 / $thoughtsPerSecBase)
    			: 1);
    		}

    		if ($$self.$$.dirty & /*$thoughtsPerSec, $thoughtsPerSecBase*/ 65537) {
    			$$invalidate(4, thoughtJerkDisplay = $thoughtsPerSec / $thoughtsPerSecBase);
    		}

    		if ($$self.$$.dirty & /*$thoughtBoostStrengthBought*/ 32768) {
    			// handle currentThoughtBoost being updated automatically when its strength is changed
    			if ($thoughtBoostStrengthBought && get_store_value(currentThoughtBoostTime) > 0) currentThoughtBoost.set(get_store_value(thoughtBoostMax));
    		}
    	};

    	return [
    		$thoughtsPerSec,
    		$upgrades,
    		buyMaxUpgrades,
    		thoughtBoostCurrentStacks,
    		thoughtJerkDisplay,
    		thoughtAccelDisplay,
    		$currentThoughtBoost,
    		$thoughtBoostMax,
    		$currentThoughtBoostTime,
    		$thoughtBoostDuration,
    		$thoughtBoostMaxStacks,
    		$unlocked,
    		$resource,
    		handleThink,
    		thoughtBoostStrengthBought,
    		$thoughtBoostStrengthBought,
    		$thoughtsPerSecBase,
    		input_change_handler,
    		func
    	];
    }

    class ThoughtComponent extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ThoughtComponent",
    			options,
    			id: create_fragment$d.name
    		});
    	}
    }

    /* src/components/misc/ProgBar.svelte generated by Svelte v3.44.1 */
    const file$c = "src/components/misc/ProgBar.svelte";

    function create_fragment$c(ctx) {
    	let div2;
    	let div1;
    	let div0;
    	let span;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			span = element("span");
    			if (default_slot) default_slot.c();
    			attr_dev(span, "id", "barLabel");
    			attr_dev(span, "class", "svelte-96i92b");
    			add_location(span, file$c, 16, 6, 489);
    			attr_dev(div0, "id", "innerBar");
    			attr_dev(div0, "class", "svelte-96i92b");
    			add_location(div0, file$c, 15, 4, 462);
    			attr_dev(div1, "id", "outerContainer");
    			attr_dev(div1, "class", "svelte-96i92b");
    			add_location(div1, file$c, 14, 2, 409);
    			add_location(div2, file$c, 13, 0, 400);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			append_dev(div0, span);

    			if (default_slot) {
    				default_slot.m(span, null);
    			}

    			/*span_binding*/ ctx[4](span);
    			/*div1_binding*/ ctx[5](div1);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (default_slot) default_slot.d(detaching);
    			/*span_binding*/ ctx[4](null);
    			/*div1_binding*/ ctx[5](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ProgBar', slots, ['default']);
    	let container;
    	let label;

    	/* function handleResize(){
      label.style.width = window.getComputedStyle(container).getPropertyValue('width')
      console.log("resize")
    } */
    	onMount(() => {
    		// let the barLabel "inherit" the width from the container
    		$$invalidate(1, label.style.width = window.getComputedStyle(container).getPropertyValue('width'), label);
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ProgBar> was created with unknown prop '${key}'`);
    	});

    	function span_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			label = $$value;
    			$$invalidate(1, label);
    		});
    	}

    	function div1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			container = $$value;
    			$$invalidate(0, container);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(2, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ onMount, container, label });

    	$$self.$inject_state = $$props => {
    		if ('container' in $$props) $$invalidate(0, container = $$props.container);
    		if ('label' in $$props) $$invalidate(1, label = $$props.label);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [container, label, $$scope, slots, span_binding, div1_binding];
    }

    class ProgBar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ProgBar",
    			options,
    			id: create_fragment$c.name
    		});
    	}
    }

    /* src/components/misc/InputRange.svelte generated by Svelte v3.44.1 */

    const file$b = "src/components/misc/InputRange.svelte";

    function create_fragment$b(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "class", "draggable svelte-1tamkwo");
    			attr_dev(input, "type", "range");
    			attr_dev(input, "min", /*min*/ ctx[1]);
    			attr_dev(input, "max", /*max*/ ctx[2]);
    			add_location(input, file$b, 6, 0, 106);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*value*/ ctx[0]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "change", /*input_change_input_handler*/ ctx[4]),
    					listen_dev(input, "input", /*input_change_input_handler*/ ctx[4]),
    					listen_dev(input, "change", /*change_handler*/ ctx[5], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*min*/ 2) {
    				attr_dev(input, "min", /*min*/ ctx[1]);
    			}

    			if (dirty & /*max*/ 4) {
    				attr_dev(input, "max", /*max*/ ctx[2]);
    			}

    			if (dirty & /*value*/ 1) {
    				set_input_value(input, /*value*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('InputRange', slots, []);
    	let { min = 0 } = $$props;
    	let { max } = $$props;
    	let { value } = $$props;
    	let { onChange } = $$props;
    	const writable_props = ['min', 'max', 'value', 'onChange'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<InputRange> was created with unknown prop '${key}'`);
    	});

    	function input_change_input_handler() {
    		value = to_number(this.value);
    		$$invalidate(0, value);
    	}

    	const change_handler = () => {
    		if (value > 0) onChange();
    	};

    	$$self.$$set = $$props => {
    		if ('min' in $$props) $$invalidate(1, min = $$props.min);
    		if ('max' in $$props) $$invalidate(2, max = $$props.max);
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    		if ('onChange' in $$props) $$invalidate(3, onChange = $$props.onChange);
    	};

    	$$self.$capture_state = () => ({ min, max, value, onChange });

    	$$self.$inject_state = $$props => {
    		if ('min' in $$props) $$invalidate(1, min = $$props.min);
    		if ('max' in $$props) $$invalidate(2, max = $$props.max);
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    		if ('onChange' in $$props) $$invalidate(3, onChange = $$props.onChange);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [value, min, max, onChange, input_change_input_handler, change_handler];
    }

    class InputRange extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, { min: 1, max: 2, value: 0, onChange: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "InputRange",
    			options,
    			id: create_fragment$b.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*max*/ ctx[2] === undefined && !('max' in props)) {
    			console.warn("<InputRange> was created without expected prop 'max'");
    		}

    		if (/*value*/ ctx[0] === undefined && !('value' in props)) {
    			console.warn("<InputRange> was created without expected prop 'value'");
    		}

    		if (/*onChange*/ ctx[3] === undefined && !('onChange' in props)) {
    			console.warn("<InputRange> was created without expected prop 'onChange'");
    		}
    	}

    	get min() {
    		throw new Error("<InputRange>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set min(value) {
    		throw new Error("<InputRange>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get max() {
    		throw new Error("<InputRange>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set max(value) {
    		throw new Error("<InputRange>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<InputRange>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<InputRange>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onChange() {
    		throw new Error("<InputRange>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onChange(value) {
    		throw new Error("<InputRange>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/tooltips/CheeseFactoryProtocol.svelte generated by Svelte v3.44.1 */
    const file$a = "src/components/tooltips/CheeseFactoryProtocol.svelte";

    // (22:4) {#if data === 'warpSpeed'}
    function create_if_block$6(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "In this mode you are unable to produce byprodcuts.";
    			attr_dev(span, "class", "effect svelte-17etath");
    			add_location(span, file$a, 22, 6, 893);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(22:4) {#if data === 'warpSpeed'}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let div;
    	let span0;
    	let t1;
    	let br;
    	let t2;
    	let span3;
    	let span1;
    	let t3_value = /*cheeseModeDescription*/ ctx[2][/*data*/ ctx[0]] + "";
    	let t3;
    	let t4;
    	let span2;
    	let t5;
    	let t6_value = cheeseModeStats[/*data*/ ctx[0]].yield + "";
    	let t6;
    	let t7;
    	let t8_value = cheeseModeStats[/*data*/ ctx[0]].duration + "";
    	let t8;
    	let t9;
    	let t10_value = cheeseModeStats[/*data*/ ctx[0]].cost + "";
    	let t10;
    	let t11;
    	let t12;
    	let if_block = /*data*/ ctx[0] === 'warpSpeed' && create_if_block$6(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			span0 = element("span");
    			span0.textContent = "Cheesy Info";
    			t1 = space();
    			br = element("br");
    			t2 = space();
    			span3 = element("span");
    			span1 = element("span");
    			t3 = text(t3_value);
    			t4 = space();
    			span2 = element("span");
    			t5 = text("Relative gain/duration/cost:\n      ");
    			t6 = text(t6_value);
    			t7 = text("x / ");
    			t8 = text(t8_value);
    			t9 = text("x / ");
    			t10 = text(t10_value);
    			t11 = text("x");
    			t12 = space();
    			if (if_block) if_block.c();
    			set_style(span0, "text-decoration", "underline");
    			set_style(span0, "font-weight", "bold");
    			set_style(span0, "color", "yellow");
    			set_style(span0, "margin-bottom", "0.25rem");
    			add_location(span0, file$a, 13, 2, 439);
    			add_location(br, file$a, 14, 2, 559);
    			add_location(span1, file$a, 16, 4, 635);
    			attr_dev(span2, "class", "effect svelte-17etath");
    			add_location(span2, file$a, 17, 4, 682);
    			set_style(span3, "display", "flex");
    			set_style(span3, "flex-direction", "column");
    			set_style(span3, "gap", "0.25rem");
    			add_location(span3, file$a, 15, 2, 568);
    			attr_dev(div, "class", "tooltip-arrow-up svelte-17etath");
    			attr_dev(div, "id", "cheeseFactoryProtocolInfo");
    			attr_dev(div, "style", /*style*/ ctx[1]);
    			add_location(div, file$a, 12, 0, 367);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span0);
    			append_dev(div, t1);
    			append_dev(div, br);
    			append_dev(div, t2);
    			append_dev(div, span3);
    			append_dev(span3, span1);
    			append_dev(span1, t3);
    			append_dev(span3, t4);
    			append_dev(span3, span2);
    			append_dev(span2, t5);
    			append_dev(span2, t6);
    			append_dev(span2, t7);
    			append_dev(span2, t8);
    			append_dev(span2, t9);
    			append_dev(span2, t10);
    			append_dev(span2, t11);
    			append_dev(span3, t12);
    			if (if_block) if_block.m(span3, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*data*/ 1 && t3_value !== (t3_value = /*cheeseModeDescription*/ ctx[2][/*data*/ ctx[0]] + "")) set_data_dev(t3, t3_value);
    			if (dirty & /*data*/ 1 && t6_value !== (t6_value = cheeseModeStats[/*data*/ ctx[0]].yield + "")) set_data_dev(t6, t6_value);
    			if (dirty & /*data*/ 1 && t8_value !== (t8_value = cheeseModeStats[/*data*/ ctx[0]].duration + "")) set_data_dev(t8, t8_value);
    			if (dirty & /*data*/ 1 && t10_value !== (t10_value = cheeseModeStats[/*data*/ ctx[0]].cost + "")) set_data_dev(t10, t10_value);

    			if (/*data*/ ctx[0] === 'warpSpeed') {
    				if (if_block) ; else {
    					if_block = create_if_block$6(ctx);
    					if_block.c();
    					if_block.m(span3, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CheeseFactoryProtocol', slots, []);
    	let { data } = $$props;
    	let { top = 0 } = $$props;
    	let { left = 0 } = $$props;
    	const style = `top: ${top}px; left: ${left - 75}px;`;

    	const cheeseModeDescription = {
    		meticulous: '"Quality over quantity"',
    		nominal: 'Everything is working nominally.',
    		warpSpeed: 'Trains the hand speed of your workers.'
    	};

    	const writable_props = ['data', 'top', 'left'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<CheeseFactoryProtocol> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('data' in $$props) $$invalidate(0, data = $$props.data);
    		if ('top' in $$props) $$invalidate(3, top = $$props.top);
    		if ('left' in $$props) $$invalidate(4, left = $$props.left);
    	};

    	$$self.$capture_state = () => ({
    		cheeseModeStats,
    		data,
    		top,
    		left,
    		style,
    		cheeseModeDescription
    	});

    	$$self.$inject_state = $$props => {
    		if ('data' in $$props) $$invalidate(0, data = $$props.data);
    		if ('top' in $$props) $$invalidate(3, top = $$props.top);
    		if ('left' in $$props) $$invalidate(4, left = $$props.left);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [data, style, cheeseModeDescription, top, left];
    }

    class CheeseFactoryProtocol extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, { data: 0, top: 3, left: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CheeseFactoryProtocol",
    			options,
    			id: create_fragment$a.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*data*/ ctx[0] === undefined && !('data' in props)) {
    			console.warn("<CheeseFactoryProtocol> was created without expected prop 'data'");
    		}
    	}

    	get data() {
    		throw new Error("<CheeseFactoryProtocol>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<CheeseFactoryProtocol>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get top() {
    		throw new Error("<CheeseFactoryProtocol>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set top(value) {
    		throw new Error("<CheeseFactoryProtocol>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get left() {
    		throw new Error("<CheeseFactoryProtocol>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set left(value) {
    		throw new Error("<CheeseFactoryProtocol>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/game-windows/CheeseComponent.svelte generated by Svelte v3.44.1 */
    const file$9 = "src/components/game-windows/CheeseComponent.svelte";

    // (133:10) {:else}
    function create_else_block_2$1(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "???";
    			set_style(div, "text-align", "center");
    			add_location(div, file$9, 133, 12, 5629);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_2$1.name,
    		type: "else",
    		source: "(133:10) {:else}",
    		ctx
    	});

    	return block;
    }

    // (117:10) {#if $unlocked.cheeseQueue}
    function create_if_block_7(ctx) {
    	let div;
    	let span0;
    	let t1;
    	let inputrange;
    	let updating_value;
    	let t2;
    	let span1;
    	let t3;
    	let div_transition;
    	let current;

    	function inputrange_value_binding(value) {
    		/*inputrange_value_binding*/ ctx[31](value);
    	}

    	let inputrange_props = {
    		min: 0,
    		max: /*$maxCheeseQueue*/ ctx[10],
    		onChange: /*handleCheeseGenerationInit*/ ctx[30]
    	};

    	if (/*$currentCheeseQueue*/ ctx[8] !== void 0) {
    		inputrange_props.value = /*$currentCheeseQueue*/ ctx[8];
    	}

    	inputrange = new InputRange({ props: inputrange_props, $$inline: true });
    	binding_callbacks.push(() => bind(inputrange, 'value', inputrange_value_binding));

    	const block = {
    		c: function create() {
    			div = element("div");
    			span0 = element("span");
    			span0.textContent = "Cheese Queue:";
    			t1 = space();
    			create_component(inputrange.$$.fragment);
    			t2 = space();
    			span1 = element("span");
    			t3 = text(/*$currentCheeseQueue*/ ctx[8]);
    			attr_dev(span0, "class", "flexCenter");
    			add_location(span0, file$9, 121, 14, 5207);
    			attr_dev(span1, "class", "flexCenter");
    			set_style(span1, "width", "40px");
    			set_style(span1, "background", "var(--Gray800)");
    			add_location(span1, file$9, 130, 14, 5477);
    			set_style(div, "display", "grid");
    			set_style(div, "grid-template-columns", "auto 1fr auto");
    			set_style(div, "gap", "8px");
    			add_location(div, file$9, 117, 12, 5040);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span0);
    			append_dev(div, t1);
    			mount_component(inputrange, div, null);
    			append_dev(div, t2);
    			append_dev(div, span1);
    			append_dev(span1, t3);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const inputrange_changes = {};
    			if (dirty[0] & /*$maxCheeseQueue*/ 1024) inputrange_changes.max = /*$maxCheeseQueue*/ ctx[10];

    			if (!updating_value && dirty[0] & /*$currentCheeseQueue*/ 256) {
    				updating_value = true;
    				inputrange_changes.value = /*$currentCheeseQueue*/ ctx[8];
    				add_flush_callback(() => updating_value = false);
    			}

    			inputrange.$set(inputrange_changes);
    			if (!current || dirty[0] & /*$currentCheeseQueue*/ 256) set_data_dev(t3, /*$currentCheeseQueue*/ ctx[8]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(inputrange.$$.fragment, local);

    			add_render_callback(() => {
    				if (!div_transition) div_transition = create_bidirectional_transition(div, fade, { duration: 1000 }, true);
    				div_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(inputrange.$$.fragment, local);
    			if (!div_transition) div_transition = create_bidirectional_transition(div, fade, { duration: 1000 }, false);
    			div_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(inputrange);
    			if (detaching && div_transition) div_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(117:10) {#if $unlocked.cheeseQueue}",
    		ctx
    	});

    	return block;
    }

    // (143:7) {#if $cheeseModeFactor.yield !== 1}
    function create_if_block_6(ctx) {
    	let span;
    	let t0;
    	let t1_value = /*$cheeseModeFactor*/ ctx[11].yield + "";
    	let t1;
    	let t2;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t0 = text("[");
    			t1 = text(t1_value);
    			t2 = text("x]");
    			set_style(span, "color", "orange");
    			add_location(span, file$9, 143, 8, 5947);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t0);
    			append_dev(span, t1);
    			append_dev(span, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*$cheeseModeFactor*/ 2048 && t1_value !== (t1_value = /*$cheeseModeFactor*/ ctx[11].yield + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(143:7) {#if $cheeseModeFactor.yield !== 1}",
    		ctx
    	});

    	return block;
    }

    // (147:9) {#if $cheeseModeFactor.duration !== 1}
    function create_if_block_5(ctx) {
    	let span;
    	let t0;
    	let t1_value = /*$cheeseModeFactor*/ ctx[11].duration + "";
    	let t1;
    	let t2;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t0 = text("[");
    			t1 = text(t1_value);
    			t2 = text("x]");
    			set_style(span, "color", "orange");
    			add_location(span, file$9, 147, 8, 6144);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t0);
    			append_dev(span, t1);
    			append_dev(span, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*$cheeseModeFactor*/ 2048 && t1_value !== (t1_value = /*$cheeseModeFactor*/ ctx[11].duration + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(147:9) {#if $cheeseModeFactor.duration !== 1}",
    		ctx
    	});

    	return block;
    }

    // (152:11) {#if $cheeseModeFactor.cost !== 1}
    function create_if_block_4$1(ctx) {
    	let span;
    	let t0;
    	let t1_value = /*$cheeseModeFactor*/ ctx[11].cost + "";
    	let t1;
    	let t2;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t0 = text("[");
    			t1 = text(t1_value);
    			t2 = text("x]");
    			set_style(span, "color", "orange");
    			add_location(span, file$9, 152, 10, 6393);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t0);
    			append_dev(span, t1);
    			append_dev(span, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*$cheeseModeFactor*/ 2048 && t1_value !== (t1_value = /*$cheeseModeFactor*/ ctx[11].cost + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$1.name,
    		type: "if",
    		source: "(152:11) {#if $cheeseModeFactor.cost !== 1}",
    		ctx
    	});

    	return block;
    }

    // (163:6) {:else}
    function create_else_block_1$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("...???");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1$1.name,
    		type: "else",
    		source: "(163:6) {:else}",
    		ctx
    	});

    	return block;
    }

    // (161:6) {#if $unlocked.cheeseCycleAccelerator}
    function create_if_block_3$2(ctx) {
    	let t0;
    	let t1_value = formatWhole(/*$cheeseQueueTotalCycles*/ ctx[7]) + "";
    	let t1;

    	const block = {
    		c: function create() {
    			t0 = text("Total Cheese Cycles: ");
    			t1 = text(t1_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*$cheeseQueueTotalCycles*/ 128 && t1_value !== (t1_value = formatWhole(/*$cheeseQueueTotalCycles*/ ctx[7]) + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$2.name,
    		type: "if",
    		source: "(161:6) {#if $unlocked.cheeseCycleAccelerator}",
    		ctx
    	});

    	return block;
    }

    // (169:2) {#if $unlocked.cheeseQueueOverclocking || $LORCA_OVERRIDE}
    function create_if_block_1$5(ctx) {
    	let div7;
    	let div6;
    	let div4;
    	let div0;
    	let span0;
    	let t1;
    	let span1;
    	let t2;
    	let t3;
    	let t4;
    	let div3;
    	let div1;
    	let span2;
    	let t6;
    	let span3;
    	let t7_value = formatNumber(/*$cheeseQueueOverclockSpeedMult*/ ctx[14], 2) + "";
    	let t7;
    	let t8;
    	let t9;
    	let div2;
    	let span4;
    	let t11;
    	let span5;
    	let t12_value = formatNumber(/*$cheeseCycleBaseCost*/ ctx[15], 2) + "";
    	let t12;
    	let t13;
    	let t14;
    	let div5;
    	let button0;
    	let img0;
    	let img0_src_value;
    	let t15;
    	let button1;
    	let img1;
    	let img1_src_value;
    	let t16;
    	let div7_transition;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = (/*$unlocked*/ ctx[6].cheeseModes || /*$LORCA_OVERRIDE*/ ctx[12]) && create_if_block_2$4(ctx);

    	const block = {
    		c: function create() {
    			div7 = element("div");
    			div6 = element("div");
    			div4 = element("div");
    			div0 = element("div");
    			span0 = element("span");
    			span0.textContent = "Overclocking";
    			t1 = space();
    			span1 = element("span");
    			t2 = text("LV");
    			t3 = text(/*$cheeseQueueOverclockLvl*/ ctx[13]);
    			t4 = space();
    			div3 = element("div");
    			div1 = element("div");
    			span2 = element("span");
    			span2.textContent = "SPEED";
    			t6 = space();
    			span3 = element("span");
    			t7 = text(t7_value);
    			t8 = text(" Hz");
    			t9 = space();
    			div2 = element("div");
    			span4 = element("span");
    			span4.textContent = "COST";
    			t11 = space();
    			span5 = element("span");
    			t12 = text(t12_value);
    			t13 = text(" thoughts/cycle");
    			t14 = space();
    			div5 = element("div");
    			button0 = element("button");
    			img0 = element("img");
    			t15 = space();
    			button1 = element("button");
    			img1 = element("img");
    			t16 = space();
    			if (if_block) if_block.c();
    			set_style(span0, "font-size", ".875rem");
    			set_style(span0, "font-weight", "bold");
    			add_location(span0, file$9, 185, 12, 7657);
    			set_style(span1, "font-size", ".875rem");
    			add_location(span1, file$9, 186, 12, 7742);
    			set_style(div0, "height", "1.25rem");
    			set_style(div0, "border-bottom", "2px solid rgba(255, 255, 255, 0.4)");
    			set_style(div0, "display", "flex");
    			set_style(div0, "align-items", "center");
    			set_style(div0, "justify-content", "center");
    			set_style(div0, "gap", "0.5rem");
    			add_location(div0, file$9, 182, 10, 7469);
    			set_style(span2, "font-weight", "bold");
    			set_style(span2, "color", "white");
    			set_style(span2, "background", "rgb(10, 125, 16)");
    			set_style(span2, "padding-left", "0.25rem");
    			set_style(span2, "padding-right", "0.25rem");
    			set_style(span2, "border-radius", "8px");
    			set_style(span2, "border", "1px solid rgba(255,255,255,0.4)");
    			add_location(span2, file$9, 193, 14, 8080);
    			add_location(span3, file$9, 198, 14, 8354);
    			set_style(div1, "width", "4rem");
    			set_style(div1, "display", "flex");
    			set_style(div1, "flex-direction", "column");
    			set_style(div1, "justify-content", "center");
    			set_style(div1, "align-items", "center");
    			set_style(div1, "gap", "0.125rem ");
    			add_location(div1, file$9, 190, 12, 7915);
    			set_style(span4, "font-weight", "bold");
    			set_style(span4, "color", "white");
    			set_style(span4, "background", "rgb(115, 0, 2)");
    			set_style(span4, "padding-left", "0.25rem");
    			set_style(span4, "padding-right", "0.25rem");
    			set_style(span4, "border-radius", "8px");
    			set_style(span4, "border", "1px solid rgba(255,255,255,0.4)");
    			add_location(span4, file$9, 203, 14, 8667);
    			add_location(span5, file$9, 208, 14, 8938);
    			set_style(div2, "width", "10rem");
    			set_style(div2, "display", "flex");
    			set_style(div2, "flex-direction", "column");
    			set_style(div2, "justify-content", "center");
    			set_style(div2, "align-items", "center");
    			set_style(div2, "gap", "0.125rem");
    			set_style(div2, "border-left", "2px solid rgba(255, 255, 255, 0.4)");
    			add_location(div2, file$9, 200, 12, 8452);
    			set_style(div3, "height", "2.5rem");
    			set_style(div3, "display", "flex");
    			set_style(div3, "flex-direction", "row");
    			add_location(div3, file$9, 189, 10, 7839);
    			set_style(div4, "display", "flex");
    			set_style(div4, "flex-direction", "column");
    			set_style(div4, "background-color", "var(--Gray800)");
    			attr_dev(div4, "class", "button-border");
    			add_location(div4, file$9, 175, 8, 7142);
    			attr_dev(img0, "alt", "+1 level");
    			if (!src_url_equal(img0.src, img0_src_value = "assets/chevron-arrow-down.png")) attr_dev(img0, "src", img0_src_value);
    			set_style(img0, "width", "50%");
    			set_style(img0, "transform", "rotate(180deg)");
    			set_style(img0, "filter", "invert(100%)");
    			add_location(img0, file$9, 214, 12, 9270);
    			set_style(button0, "height", "2rem");
    			set_style(button0, "width", "2rem");
    			add_location(button0, file$9, 213, 10, 9171);
    			attr_dev(img1, "alt", "-1 level");
    			if (!src_url_equal(img1.src, img1_src_value = "assets/chevron-arrow-down.png")) attr_dev(img1, "src", img1_src_value);
    			set_style(img1, "width", "50%");
    			set_style(img1, "filter", "invert(100%)");
    			add_location(img1, file$9, 221, 12, 9582);
    			set_style(button1, "height", "2rem");
    			set_style(button1, "width", "2rem");
    			add_location(button1, file$9, 220, 10, 9483);
    			set_style(div5, "width", "100%");
    			set_style(div5, "display", "flex");
    			set_style(div5, "flex-direction", "column");
    			set_style(div5, "justify-content", "space-between");
    			add_location(div5, file$9, 212, 8, 9066);
    			set_style(div6, "display", "flex");
    			set_style(div6, "flex-direction", "row");
    			set_style(div6, "gap", "2px");
    			add_location(div6, file$9, 174, 6, 7076);
    			attr_dev(div7, "class", "flexRowContainer");
    			set_style(div7, "align-items", "flex-end");
    			set_style(div7, "margin-top", "-8px");
    			set_style(div7, "height", "71px");
    			add_location(div7, file$9, 169, 4, 6917);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div7, anchor);
    			append_dev(div7, div6);
    			append_dev(div6, div4);
    			append_dev(div4, div0);
    			append_dev(div0, span0);
    			append_dev(div0, t1);
    			append_dev(div0, span1);
    			append_dev(span1, t2);
    			append_dev(span1, t3);
    			append_dev(div4, t4);
    			append_dev(div4, div3);
    			append_dev(div3, div1);
    			append_dev(div1, span2);
    			append_dev(div1, t6);
    			append_dev(div1, span3);
    			append_dev(span3, t7);
    			append_dev(span3, t8);
    			append_dev(div3, t9);
    			append_dev(div3, div2);
    			append_dev(div2, span4);
    			append_dev(div2, t11);
    			append_dev(div2, span5);
    			append_dev(span5, t12);
    			append_dev(span5, t13);
    			append_dev(div6, t14);
    			append_dev(div6, div5);
    			append_dev(div5, button0);
    			append_dev(button0, img0);
    			append_dev(div5, t15);
    			append_dev(div5, button1);
    			append_dev(button1, img1);
    			append_dev(div7, t16);
    			if (if_block) if_block.m(div7, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(tooltip.call(null, div4, {
    						data: 'Increases the speed of a cheese cycle. <br> Every level increases SPEED by 5%, but doubles the COST. <br> (multiplicative)'
    					})),
    					listen_dev(button0, "click", /*click_handler*/ ctx[32], false, false, false),
    					listen_dev(button1, "click", /*click_handler_1*/ ctx[33], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty[0] & /*$cheeseQueueOverclockLvl*/ 8192) set_data_dev(t3, /*$cheeseQueueOverclockLvl*/ ctx[13]);
    			if ((!current || dirty[0] & /*$cheeseQueueOverclockSpeedMult*/ 16384) && t7_value !== (t7_value = formatNumber(/*$cheeseQueueOverclockSpeedMult*/ ctx[14], 2) + "")) set_data_dev(t7, t7_value);
    			if ((!current || dirty[0] & /*$cheeseCycleBaseCost*/ 32768) && t12_value !== (t12_value = formatNumber(/*$cheeseCycleBaseCost*/ ctx[15], 2) + "")) set_data_dev(t12, t12_value);

    			if (/*$unlocked*/ ctx[6].cheeseModes || /*$LORCA_OVERRIDE*/ ctx[12]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*$unlocked, $LORCA_OVERRIDE*/ 4160) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_2$4(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div7, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);

    			add_render_callback(() => {
    				if (!div7_transition) div7_transition = create_bidirectional_transition(div7, slide, { duration: 1000 }, true);
    				div7_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			if (!div7_transition) div7_transition = create_bidirectional_transition(div7, slide, { duration: 1000 }, false);
    			div7_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div7);
    			if (if_block) if_block.d();
    			if (detaching && div7_transition) div7_transition.end();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$5.name,
    		type: "if",
    		source: "(169:2) {#if $unlocked.cheeseQueueOverclocking || $LORCA_OVERRIDE}",
    		ctx
    	});

    	return block;
    }

    // (227:6) {#if $unlocked.cheeseModes || $LORCA_OVERRIDE}
    function create_if_block_2$4(ctx) {
    	let div;
    	let fieldset;
    	let legend;
    	let t1;
    	let label0;
    	let input0;
    	let t2;
    	let t3;
    	let label1;
    	let input1;
    	let t4;
    	let t5;
    	let label2;
    	let input2;
    	let t6;
    	let div_transition;
    	let current;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			fieldset = element("fieldset");
    			legend = element("legend");
    			legend.textContent = "Cheese Factory Protocol";
    			t1 = space();
    			label0 = element("label");
    			input0 = element("input");
    			t2 = text("\n              meticulous");
    			t3 = space();
    			label1 = element("label");
    			input1 = element("input");
    			t4 = text("\n              nominal");
    			t5 = space();
    			label2 = element("label");
    			input2 = element("input");
    			t6 = text("\n              warp speed");
    			add_location(legend, file$9, 229, 12, 9898);
    			attr_dev(input0, "type", "radio");
    			attr_dev(input0, "name", "cheeseFactoryMode");
    			input0.__value = "meticulous";
    			input0.value = input0.__value;
    			/*$$binding_groups*/ ctx[35][0].push(input0);
    			add_location(input0, file$9, 232, 14, 10070);
    			add_location(label0, file$9, 231, 12, 9952);
    			attr_dev(input1, "type", "radio");
    			attr_dev(input1, "name", "cheeseFactoryMode");
    			input1.__value = "nominal";
    			input1.value = input1.__value;
    			/*$$binding_groups*/ ctx[35][0].push(input1);
    			add_location(input1, file$9, 236, 14, 10342);
    			add_location(label1, file$9, 235, 12, 10227);
    			attr_dev(input2, "type", "radio");
    			attr_dev(input2, "name", "cheeseFactoryMode");
    			input2.__value = "warpSpeed";
    			input2.value = input2.__value;
    			/*$$binding_groups*/ ctx[35][0].push(input2);
    			add_location(input2, file$9, 240, 14, 10610);
    			add_location(label2, file$9, 239, 12, 10493);
    			add_location(fieldset, file$9, 228, 10, 9848);
    			add_location(div, file$9, 227, 8, 9794);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, fieldset);
    			append_dev(fieldset, legend);
    			append_dev(fieldset, t1);
    			append_dev(fieldset, label0);
    			append_dev(label0, input0);
    			input0.checked = input0.__value === /*$cheeseFactoryMode*/ ctx[16];
    			append_dev(label0, t2);
    			append_dev(fieldset, t3);
    			append_dev(fieldset, label1);
    			append_dev(label1, input1);
    			input1.checked = input1.__value === /*$cheeseFactoryMode*/ ctx[16];
    			append_dev(label1, t4);
    			append_dev(fieldset, t5);
    			append_dev(fieldset, label2);
    			append_dev(label2, input2);
    			input2.checked = input2.__value === /*$cheeseFactoryMode*/ ctx[16];
    			append_dev(label2, t6);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "change", /*input0_change_handler*/ ctx[34]),
    					action_destroyer(tooltip.call(null, label0, {
    						data: 'meticulous',
    						Component: CheeseFactoryProtocol,
    						anchor: 'parentElement'
    					})),
    					listen_dev(input1, "change", /*input1_change_handler*/ ctx[36]),
    					action_destroyer(tooltip.call(null, label1, {
    						data: 'nominal',
    						Component: CheeseFactoryProtocol,
    						anchor: 'parentElement'
    					})),
    					listen_dev(input2, "change", /*input2_change_handler*/ ctx[37]),
    					action_destroyer(tooltip.call(null, label2, {
    						data: 'warpSpeed',
    						Component: CheeseFactoryProtocol,
    						anchor: 'parentElement'
    					})),
    					listen_dev(fieldset, "change", /*resetCheeseBar*/ ctx[29], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*$cheeseFactoryMode*/ 65536) {
    				input0.checked = input0.__value === /*$cheeseFactoryMode*/ ctx[16];
    			}

    			if (dirty[0] & /*$cheeseFactoryMode*/ 65536) {
    				input1.checked = input1.__value === /*$cheeseFactoryMode*/ ctx[16];
    			}

    			if (dirty[0] & /*$cheeseFactoryMode*/ 65536) {
    				input2.checked = input2.__value === /*$cheeseFactoryMode*/ ctx[16];
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!div_transition) div_transition = create_bidirectional_transition(div, slide, { duration: 1000 }, true);
    				div_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!div_transition) div_transition = create_bidirectional_transition(div, slide, { duration: 1000 }, false);
    			div_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			/*$$binding_groups*/ ctx[35][0].splice(/*$$binding_groups*/ ctx[35][0].indexOf(input0), 1);
    			/*$$binding_groups*/ ctx[35][0].splice(/*$$binding_groups*/ ctx[35][0].indexOf(input1), 1);
    			/*$$binding_groups*/ ctx[35][0].splice(/*$$binding_groups*/ ctx[35][0].indexOf(input2), 1);
    			if (detaching && div_transition) div_transition.end();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$4.name,
    		type: "if",
    		source: "(227:6) {#if $unlocked.cheeseModes || $LORCA_OVERRIDE}",
    		ctx
    	});

    	return block;
    }

    // (254:6) <UpgradeButton         upgradeName="cheeseYield"         {buyMaxUpgrades}         tooltipText={`+${formatNumber(           (($upgrades.cheeseYield.bought + 1) * $cheeseCycleBatchSize) / $cheeseCycleBaseYield,           2         )}          cheese per cycle <br>         +${formatTime((cheeseYieldDeltaDuration * $cheeseCycleDuration) / $cheeseCycleBaseDuration / 1000)}          cycle duration <br>(without scaling: +0.5s cycle duration)`}       >
    function create_default_slot_10(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Your workers create more cheese but also take longer");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_10.name,
    		type: "slot",
    		source: "(254:6) <UpgradeButton         upgradeName=\\\"cheeseYield\\\"         {buyMaxUpgrades}         tooltipText={`+${formatNumber(           (($upgrades.cheeseYield.bought + 1) * $cheeseCycleBatchSize) / $cheeseCycleBaseYield,           2         )}          cheese per cycle <br>         +${formatTime((cheeseYieldDeltaDuration * $cheeseCycleDuration) / $cheeseCycleBaseDuration / 1000)}          cycle duration <br>(without scaling: +0.5s cycle duration)`}       >",
    		ctx
    	});

    	return block;
    }

    // (268:6) <UpgradeButton         upgradeName="cheeseQueueLength"         {buyMaxUpgrades}         btnUnlocked={$unlocked.cheeseQueue}         tooltipText={`+${5} capacity <br> Currently: ${$maxCheeseQueue}`}       >
    function create_default_slot_9(ctx) {
    	let span1;
    	let t0;
    	let span0;

    	const block = {
    		c: function create() {
    			span1 = element("span");
    			t0 = text("Lengthen the ");
    			span0 = element("span");
    			span0.textContent = "Cheese Queue";
    			set_style(span0, "color", "yellow");
    			set_style(span0, "font-weight", "bold");
    			add_location(span0, file$9, 273, 27, 11748);
    			add_location(span1, file$9, 273, 8, 11729);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span1, anchor);
    			append_dev(span1, t0);
    			append_dev(span1, span0);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_9.name,
    		type: "slot",
    		source: "(268:6) <UpgradeButton         upgradeName=\\\"cheeseQueueLength\\\"         {buyMaxUpgrades}         btnUnlocked={$unlocked.cheeseQueue}         tooltipText={`+${5} capacity <br> Currently: ${$maxCheeseQueue}`}       >",
    		ctx
    	});

    	return block;
    }

    // (287:8) {:else}
    function create_else_block$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Increase effect of cheese boosting thought gain");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(287:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (285:8) {#if $upgrades.cheeseThoughtMult.bought === 0}
    function create_if_block$5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Cheese increases thought gain");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(285:8) {#if $upgrades.cheeseThoughtMult.bought === 0}",
    		ctx
    	});

    	return block;
    }

    // (277:6) <UpgradeButton         upgradeName="cheeseThoughtMult"         {buyMaxUpgrades}         btnUnlocked={$unlocked.cheeseQueue}         tooltipText={`Currently: ${           $upgrades.cheeseThoughtMult.bought * $upgrades.cheeseThoughtMult.bought         }x <br> Scales ^2 with #upgrades.`}       >
    function create_default_slot_8$1(ctx) {
    	let if_block_anchor;

    	function select_block_type_2(ctx, dirty) {
    		if (/*$upgrades*/ ctx[17].cheeseThoughtMult.bought === 0) return create_if_block$5;
    		return create_else_block$2;
    	}

    	let current_block_type = select_block_type_2(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type !== (current_block_type = select_block_type_2(ctx))) {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8$1.name,
    		type: "slot",
    		source: "(277:6) <UpgradeButton         upgradeName=\\\"cheeseThoughtMult\\\"         {buyMaxUpgrades}         btnUnlocked={$unlocked.cheeseQueue}         tooltipText={`Currently: ${           $upgrades.cheeseThoughtMult.bought * $upgrades.cheeseThoughtMult.bought         }x <br> Scales ^2 with #upgrades.`}       >",
    		ctx
    	});

    	return block;
    }

    // (292:6) <UpgradeButton         upgradeName="cheeseQueueOverclockingCost"         {buyMaxUpgrades}         btnUnlocked={$unlocked.cheeseQueueCostDivide}         tooltipText={`Current Divisor: ${formatNumber($cheeseQueueCostDivideBy, 2)}`}       >
    function create_default_slot_7$2(ctx) {
    	let t;
    	let br;

    	const block = {
    		c: function create() {
    			t = text("Divide the cost requirement of Overclocking ");
    			br = element("br");
    			add_location(br, file$9, 297, 52, 12648);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    			insert_dev(target, br, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(br);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7$2.name,
    		type: "slot",
    		source: "(292:6) <UpgradeButton         upgradeName=\\\"cheeseQueueOverclockingCost\\\"         {buyMaxUpgrades}         btnUnlocked={$unlocked.cheeseQueueCostDivide}         tooltipText={`Current Divisor: ${formatNumber($cheeseQueueCostDivideBy, 2)}`}       >",
    		ctx
    	});

    	return block;
    }

    // (306:8) <Effect           factor={$cheeseThoughtMult}           unlocked={$upgrades.cheeseThoughtMult.bought > 0}           tooltipText={`Scaling: log(cheese) &times; ${             $upgrades.cheeseThoughtMult.bought * $upgrades.cheeseThoughtMult.bought           }`}         >
    function create_default_slot_6$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Cheese increases thoughts/s");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6$2.name,
    		type: "slot",
    		source: "(306:8) <Effect           factor={$cheeseThoughtMult}           unlocked={$upgrades.cheeseThoughtMult.bought > 0}           tooltipText={`Scaling: log(cheese) &times; ${             $upgrades.cheeseThoughtMult.bought * $upgrades.cheeseThoughtMult.bought           }`}         >",
    		ctx
    	});

    	return block;
    }

    // (316:8) <Effect           factor={$cheeseQueueLengthBoostFactor}           unlocked={$unlocked.cheeseQueueLengthBoost}           tooltipText="Scaling: capacity^2"         >
    function create_default_slot_5$2(ctx) {
    	let t_value = unlocks.cheese.find(/*func*/ ctx[38])?.description + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5$2.name,
    		type: "slot",
    		source: "(316:8) <Effect           factor={$cheeseQueueLengthBoostFactor}           unlocked={$unlocked.cheeseQueueLengthBoost}           tooltipText=\\\"Scaling: capacity^2\\\"         >",
    		ctx
    	});

    	return block;
    }

    // (324:8) <Effect           factor={$cheeseCycleAcceleratorFactor}           unlocked={$unlocked.cheeseCycleAccelerator}           tooltipText="Scaling: log(cycles)"         >
    function create_default_slot_4$2(ctx) {
    	let t_value = unlocks.cheese.find(/*func_1*/ ctx[39])?.description + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$2.name,
    		type: "slot",
    		source: "(324:8) <Effect           factor={$cheeseCycleAcceleratorFactor}           unlocked={$unlocked.cheeseCycleAccelerator}           tooltipText=\\\"Scaling: log(cycles)\\\"         >",
    		ctx
    	});

    	return block;
    }

    // (332:8) <Effect           factor={$cheeseCyclesThoughtMult}           unlocked={$unlocked.cheeseCyclesBoostThoughts}           tooltipText="Scaling: cycles^1.5"         >
    function create_default_slot_3$2(ctx) {
    	let t_value = unlocks.cheese.find(/*func_2*/ ctx[40])?.description + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$2.name,
    		type: "slot",
    		source: "(332:8) <Effect           factor={$cheeseCyclesThoughtMult}           unlocked={$unlocked.cheeseCyclesBoostThoughts}           tooltipText=\\\"Scaling: cycles^1.5\\\"         >",
    		ctx
    	});

    	return block;
    }

    // (340:8) <Effect           factor={$mcCycleDurationBoostFactor}           unlocked={$unlocked.moldyCheeseCycleDurationBoost}           tooltipText={`Scales ^${1.5} with relative duration.`}         >
    function create_default_slot_2$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("MC byproduct gain is boosted by the rel. duration of the cheese cycle");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$2.name,
    		type: "slot",
    		source: "(340:8) <Effect           factor={$mcCycleDurationBoostFactor}           unlocked={$unlocked.moldyCheeseCycleDurationBoost}           tooltipText={`Scales ^${1.5} with relative duration.`}         >",
    		ctx
    	});

    	return block;
    }

    // (303:6) <EffectComponent         title={$upgrades.cheeseThoughtMult.bought > 0 || $unlocked.cheeseQueueLengthBoost ? 'Effects' : '???'}       >
    function create_default_slot_1$2(ctx) {
    	let effect0;
    	let t0;
    	let effect1;
    	let t1;
    	let effect2;
    	let t2;
    	let effect3;
    	let t3;
    	let effect4;
    	let current;

    	effect0 = new Effect({
    			props: {
    				factor: /*$cheeseThoughtMult*/ ctx[21],
    				unlocked: /*$upgrades*/ ctx[17].cheeseThoughtMult.bought > 0,
    				tooltipText: `Scaling: log(cheese) &times; ${/*$upgrades*/ ctx[17].cheeseThoughtMult.bought * /*$upgrades*/ ctx[17].cheeseThoughtMult.bought}`,
    				$$slots: { default: [create_default_slot_6$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	effect1 = new Effect({
    			props: {
    				factor: /*$cheeseQueueLengthBoostFactor*/ ctx[22],
    				unlocked: /*$unlocked*/ ctx[6].cheeseQueueLengthBoost,
    				tooltipText: "Scaling: capacity^2",
    				$$slots: { default: [create_default_slot_5$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	effect2 = new Effect({
    			props: {
    				factor: /*$cheeseCycleAcceleratorFactor*/ ctx[23],
    				unlocked: /*$unlocked*/ ctx[6].cheeseCycleAccelerator,
    				tooltipText: "Scaling: log(cycles)",
    				$$slots: { default: [create_default_slot_4$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	effect3 = new Effect({
    			props: {
    				factor: /*$cheeseCyclesThoughtMult*/ ctx[24],
    				unlocked: /*$unlocked*/ ctx[6].cheeseCyclesBoostThoughts,
    				tooltipText: "Scaling: cycles^1.5",
    				$$slots: { default: [create_default_slot_3$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	effect4 = new Effect({
    			props: {
    				factor: /*$mcCycleDurationBoostFactor*/ ctx[25],
    				unlocked: /*$unlocked*/ ctx[6].moldyCheeseCycleDurationBoost,
    				tooltipText: `Scales ^${1.5} with relative duration.`,
    				$$slots: { default: [create_default_slot_2$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(effect0.$$.fragment);
    			t0 = space();
    			create_component(effect1.$$.fragment);
    			t1 = space();
    			create_component(effect2.$$.fragment);
    			t2 = space();
    			create_component(effect3.$$.fragment);
    			t3 = space();
    			create_component(effect4.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(effect0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(effect1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(effect2, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(effect3, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(effect4, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const effect0_changes = {};
    			if (dirty[0] & /*$cheeseThoughtMult*/ 2097152) effect0_changes.factor = /*$cheeseThoughtMult*/ ctx[21];
    			if (dirty[0] & /*$upgrades*/ 131072) effect0_changes.unlocked = /*$upgrades*/ ctx[17].cheeseThoughtMult.bought > 0;
    			if (dirty[0] & /*$upgrades*/ 131072) effect0_changes.tooltipText = `Scaling: log(cheese) &times; ${/*$upgrades*/ ctx[17].cheeseThoughtMult.bought * /*$upgrades*/ ctx[17].cheeseThoughtMult.bought}`;

    			if (dirty[1] & /*$$scope*/ 32768) {
    				effect0_changes.$$scope = { dirty, ctx };
    			}

    			effect0.$set(effect0_changes);
    			const effect1_changes = {};
    			if (dirty[0] & /*$cheeseQueueLengthBoostFactor*/ 4194304) effect1_changes.factor = /*$cheeseQueueLengthBoostFactor*/ ctx[22];
    			if (dirty[0] & /*$unlocked*/ 64) effect1_changes.unlocked = /*$unlocked*/ ctx[6].cheeseQueueLengthBoost;

    			if (dirty[1] & /*$$scope*/ 32768) {
    				effect1_changes.$$scope = { dirty, ctx };
    			}

    			effect1.$set(effect1_changes);
    			const effect2_changes = {};
    			if (dirty[0] & /*$cheeseCycleAcceleratorFactor*/ 8388608) effect2_changes.factor = /*$cheeseCycleAcceleratorFactor*/ ctx[23];
    			if (dirty[0] & /*$unlocked*/ 64) effect2_changes.unlocked = /*$unlocked*/ ctx[6].cheeseCycleAccelerator;

    			if (dirty[1] & /*$$scope*/ 32768) {
    				effect2_changes.$$scope = { dirty, ctx };
    			}

    			effect2.$set(effect2_changes);
    			const effect3_changes = {};
    			if (dirty[0] & /*$cheeseCyclesThoughtMult*/ 16777216) effect3_changes.factor = /*$cheeseCyclesThoughtMult*/ ctx[24];
    			if (dirty[0] & /*$unlocked*/ 64) effect3_changes.unlocked = /*$unlocked*/ ctx[6].cheeseCyclesBoostThoughts;

    			if (dirty[1] & /*$$scope*/ 32768) {
    				effect3_changes.$$scope = { dirty, ctx };
    			}

    			effect3.$set(effect3_changes);
    			const effect4_changes = {};
    			if (dirty[0] & /*$mcCycleDurationBoostFactor*/ 33554432) effect4_changes.factor = /*$mcCycleDurationBoostFactor*/ ctx[25];
    			if (dirty[0] & /*$unlocked*/ 64) effect4_changes.unlocked = /*$unlocked*/ ctx[6].moldyCheeseCycleDurationBoost;

    			if (dirty[1] & /*$$scope*/ 32768) {
    				effect4_changes.$$scope = { dirty, ctx };
    			}

    			effect4.$set(effect4_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(effect0.$$.fragment, local);
    			transition_in(effect1.$$.fragment, local);
    			transition_in(effect2.$$.fragment, local);
    			transition_in(effect3.$$.fragment, local);
    			transition_in(effect4.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(effect0.$$.fragment, local);
    			transition_out(effect1.$$.fragment, local);
    			transition_out(effect2.$$.fragment, local);
    			transition_out(effect3.$$.fragment, local);
    			transition_out(effect4.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(effect0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(effect1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(effect2, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(effect3, detaching);
    			if (detaching) detach_dev(t3);
    			destroy_component(effect4, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$2.name,
    		type: "slot",
    		source: "(303:6) <EffectComponent         title={$upgrades.cheeseThoughtMult.bought > 0 || $unlocked.cheeseQueueLengthBoost ? 'Effects' : '???'}       >",
    		ctx
    	});

    	return block;
    }

    // (90:0) <Window title="Switzerland Simulator" themeColor1="rgb(168, 143, 2)" themeColor2="rgb(244, 255, 33)">
    function create_default_slot$4(ctx) {
    	let div0;
    	let span1;
    	let t0;
    	let t1_value = formatNumber(/*$resource*/ ctx[5].cheese, 2) + "";
    	let t1;
    	let t2;
    	let span0;
    	let t4;
    	let br0;
    	let t5;
    	let t6_value = formatNumber(/*cheesePerSecFromQueue*/ ctx[4], 2) + "";
    	let t6;
    	let t7;
    	let t8;
    	let div5;
    	let div4;
    	let button;
    	let t9;
    	let br1;
    	let t10;
    	let t11_value = formatNumber(/*$cheeseCycleCost*/ ctx[9], 2) + "";
    	let t11;
    	let t12;
    	let t13;
    	let div3;
    	let div1;
    	let progbar;
    	let div;
    	let __progress_last;
    	let t14;
    	let div2;
    	let current_block_type_index;
    	let if_block0;
    	let t15;
    	let p;
    	let t16;
    	let t17_value = formatNumber(/*$cheeseCycleBatchSize*/ ctx[0], 2) + "";
    	let t17;
    	let t18;
    	let t19_value = formatTime(/*$cheeseCycleDuration*/ ctx[2] / 1000) + "";
    	let t19;
    	let t20;
    	let span2;
    	let t21;
    	let t22_value = formatNumber(/*$cheeseCycleCost*/ ctx[9], 2) + "";
    	let t22;
    	let t23;
    	let t24_value = formatNumber(/*$cheeseCycleCost*/ ctx[9] / /*$cheeseCycleDuration*/ ctx[2] * 1000, 2) + "";
    	let t24;
    	let t25;
    	let span2_transition;
    	let t26;
    	let span3;
    	let span3_transition;
    	let t27;
    	let t28;
    	let unlockdrawer;
    	let t29;
    	let div8;
    	let div6;
    	let upgradebutton0;
    	let t30;
    	let upgradebutton1;
    	let t31;
    	let upgradebutton2;
    	let t32;
    	let upgradebutton3;
    	let t33;
    	let div7;
    	let effectcomponent;
    	let current;
    	let mounted;
    	let dispose;
    	progbar = new ProgBar({ $$inline: true });
    	const if_block_creators = [create_if_block_7, create_else_block_2$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$unlocked*/ ctx[6].cheeseQueue) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	let if_block1 = /*$cheeseModeFactor*/ ctx[11].yield !== 1 && create_if_block_6(ctx);
    	let if_block2 = /*$cheeseModeFactor*/ ctx[11].duration !== 1 && create_if_block_5(ctx);
    	let if_block3 = /*$cheeseModeFactor*/ ctx[11].cost !== 1 && create_if_block_4$1(ctx);

    	function select_block_type_1(ctx, dirty) {
    		if (/*$unlocked*/ ctx[6].cheeseCycleAccelerator) return create_if_block_3$2;
    		return create_else_block_1$1;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block4 = current_block_type(ctx);
    	let if_block5 = (/*$unlocked*/ ctx[6].cheeseQueueOverclocking || /*$LORCA_OVERRIDE*/ ctx[12]) && create_if_block_1$5(ctx);

    	unlockdrawer = new UnlockDrawer({
    			props: {
    				unlocks: unlocks.cheese,
    				folderName: "Free 50 Aeromancer Skills"
    			},
    			$$inline: true
    		});

    	upgradebutton0 = new UpgradeButton({
    			props: {
    				upgradeName: "cheeseYield",
    				buyMaxUpgrades: buyMaxUpgrades$2,
    				tooltipText: `+${formatNumber((/*$upgrades*/ ctx[17].cheeseYield.bought + 1) * /*$cheeseCycleBatchSize*/ ctx[0] / /*$cheeseCycleBaseYield*/ ctx[18], 2)} 
        cheese per cycle <br>
        +${formatTime(cheeseYieldDeltaDuration * /*$cheeseCycleDuration*/ ctx[2] / /*$cheeseCycleBaseDuration*/ ctx[19] / 1000)} 
        cycle duration <br>(without scaling: +0.5s cycle duration)`,
    				$$slots: { default: [create_default_slot_10] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	upgradebutton1 = new UpgradeButton({
    			props: {
    				upgradeName: "cheeseQueueLength",
    				buyMaxUpgrades: buyMaxUpgrades$2,
    				btnUnlocked: /*$unlocked*/ ctx[6].cheeseQueue,
    				tooltipText: `+${5} capacity <br> Currently: ${/*$maxCheeseQueue*/ ctx[10]}`,
    				$$slots: { default: [create_default_slot_9] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	upgradebutton2 = new UpgradeButton({
    			props: {
    				upgradeName: "cheeseThoughtMult",
    				buyMaxUpgrades: buyMaxUpgrades$2,
    				btnUnlocked: /*$unlocked*/ ctx[6].cheeseQueue,
    				tooltipText: `Currently: ${/*$upgrades*/ ctx[17].cheeseThoughtMult.bought * /*$upgrades*/ ctx[17].cheeseThoughtMult.bought}x <br> Scales ^2 with #upgrades.`,
    				$$slots: { default: [create_default_slot_8$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	upgradebutton3 = new UpgradeButton({
    			props: {
    				upgradeName: "cheeseQueueOverclockingCost",
    				buyMaxUpgrades: buyMaxUpgrades$2,
    				btnUnlocked: /*$unlocked*/ ctx[6].cheeseQueueCostDivide,
    				tooltipText: `Current Divisor: ${formatNumber(/*$cheeseQueueCostDivideBy*/ ctx[20], 2)}`,
    				$$slots: { default: [create_default_slot_7$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	effectcomponent = new EffectComponent({
    			props: {
    				title: /*$upgrades*/ ctx[17].cheeseThoughtMult.bought > 0 || /*$unlocked*/ ctx[6].cheeseQueueLengthBoost
    				? 'Effects'
    				: '???',
    				$$slots: { default: [create_default_slot_1$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			span1 = element("span");
    			t0 = text("You have ");
    			t1 = text(t1_value);
    			t2 = space();
    			span0 = element("span");
    			span0.textContent = "cheese";
    			t4 = space();
    			br0 = element("br");
    			t5 = text("\n    ~ ");
    			t6 = text(t6_value);
    			t7 = text("/s");
    			t8 = space();
    			div5 = element("div");
    			div4 = element("div");
    			button = element("button");
    			t9 = text("Make cheese ");
    			br1 = element("br");
    			t10 = space();
    			t11 = text(t11_value);
    			t12 = text(" thoughts");
    			t13 = space();
    			div3 = element("div");
    			div1 = element("div");
    			div = element("div");
    			create_component(progbar.$$.fragment);
    			t14 = space();
    			div2 = element("div");
    			if_block0.c();
    			t15 = space();
    			p = element("p");
    			t16 = text("Industrious swiss workers are producing\n      ");
    			t17 = text(t17_value);
    			if (if_block1) if_block1.c();
    			t18 = text(" cheese every\n      ");
    			t19 = text(t19_value);
    			if (if_block2) if_block2.c();
    			t20 = space();
    			span2 = element("span");
    			t21 = text("while consuming ");
    			t22 = text(t22_value);
    			if (if_block3) if_block3.c();
    			t23 = text("\n        thoughts. (~");
    			t24 = text(t24_value);
    			t25 = text("\n        thoughts/s)");
    			t26 = space();
    			span3 = element("span");
    			if_block4.c();
    			t27 = space();
    			if (if_block5) if_block5.c();
    			t28 = space();
    			create_component(unlockdrawer.$$.fragment);
    			t29 = space();
    			div8 = element("div");
    			div6 = element("div");
    			create_component(upgradebutton0.$$.fragment);
    			t30 = space();
    			create_component(upgradebutton1.$$.fragment);
    			t31 = space();
    			create_component(upgradebutton2.$$.fragment);
    			t32 = space();
    			create_component(upgradebutton3.$$.fragment);
    			t33 = space();
    			div7 = element("div");
    			create_component(effectcomponent.$$.fragment);
    			attr_dev(span0, "class", "colorText svelte-t0u0g7");
    			set_style(span0, "font-weight", "bold");
    			add_location(span0, file$9, 92, 52, 4198);
    			add_location(br0, file$9, 93, 6, 4267);
    			attr_dev(span1, "class", "resourceDisplay");
    			add_location(span1, file$9, 91, 4, 4116);
    			add_location(div0, file$9, 90, 2, 4106);
    			add_location(br1, file$9, 101, 20, 4557);
    			set_style(button, "width", "170px");
    			button.disabled = /*$cheeseQueueActive*/ ctx[1];
    			add_location(button, file$9, 100, 6, 4439);
    			set_style(div, "display", "contents");
    			set_style(div, "--width", "100%");
    			set_style(div, "--height", "24px");
    			set_style(div, "--barColor", "yellow");
    			set_style(div, "--progress", __progress_last = "" + (100 * /*cheeseBarProgress*/ ctx[3] / /*$cheeseCycleDuration*/ ctx[2] + "%"));
    			attr_dev(div1, "id", "cheeseBar");
    			attr_dev(div1, "class", "svelte-t0u0g7");
    			add_location(div1, file$9, 106, 8, 4693);
    			set_style(div2, "width", "100%");
    			set_style(div2, "height", "16px");
    			set_style(div2, "margin-top", "4px");
    			add_location(div2, file$9, 115, 8, 4934);
    			attr_dev(div3, "class", "gridColumn");
    			set_style(div3, "width", "100%");
    			add_location(div3, file$9, 105, 6, 4640);
    			attr_dev(div4, "class", "flexRowContainer");
    			add_location(div4, file$9, 99, 4, 4402);
    			add_location(span2, file$9, 149, 6, 6229);
    			set_style(p, "margin-bottom", "0px");
    			set_style(p, "margin-top", "8px");
    			set_style(p, "height", "1.625rem");
    			add_location(p, file$9, 139, 4, 5732);
    			set_style(span3, "margin-top", ".25rem");
    			add_location(span3, file$9, 159, 4, 6606);
    			set_style(div5, "display", "flex");
    			set_style(div5, "flex-direction", "column");
    			add_location(div5, file$9, 98, 2, 4347);
    			attr_dev(div6, "class", "gridColumn");
    			add_location(div6, file$9, 252, 4, 10944);
    			attr_dev(div7, "class", "gridColumn");
    			set_style(div7, "height", "264px");
    			set_style(div7, "width", "100%");
    			add_location(div7, file$9, 301, 4, 12694);
    			attr_dev(div8, "class", "flexRowContainer");
    			add_location(div8, file$9, 251, 2, 10909);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, span1);
    			append_dev(span1, t0);
    			append_dev(span1, t1);
    			append_dev(span1, t2);
    			append_dev(span1, span0);
    			append_dev(span1, t4);
    			append_dev(span1, br0);
    			append_dev(div0, t5);
    			append_dev(div0, t6);
    			append_dev(div0, t7);
    			insert_dev(target, t8, anchor);
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div4);
    			append_dev(div4, button);
    			append_dev(button, t9);
    			append_dev(button, br1);
    			append_dev(button, t10);
    			append_dev(button, t11);
    			append_dev(button, t12);
    			append_dev(div4, t13);
    			append_dev(div4, div3);
    			append_dev(div3, div1);
    			append_dev(div1, div);
    			mount_component(progbar, div, null);
    			append_dev(div3, t14);
    			append_dev(div3, div2);
    			if_blocks[current_block_type_index].m(div2, null);
    			append_dev(div5, t15);
    			append_dev(div5, p);
    			append_dev(p, t16);
    			append_dev(p, t17);
    			if (if_block1) if_block1.m(p, null);
    			append_dev(p, t18);
    			append_dev(p, t19);
    			if (if_block2) if_block2.m(p, null);
    			append_dev(p, t20);
    			append_dev(p, span2);
    			append_dev(span2, t21);
    			append_dev(span2, t22);
    			if (if_block3) if_block3.m(span2, null);
    			append_dev(span2, t23);
    			append_dev(span2, t24);
    			append_dev(span2, t25);
    			append_dev(div5, t26);
    			append_dev(div5, span3);
    			if_block4.m(span3, null);
    			insert_dev(target, t27, anchor);
    			if (if_block5) if_block5.m(target, anchor);
    			insert_dev(target, t28, anchor);
    			mount_component(unlockdrawer, target, anchor);
    			insert_dev(target, t29, anchor);
    			insert_dev(target, div8, anchor);
    			append_dev(div8, div6);
    			mount_component(upgradebutton0, div6, null);
    			append_dev(div6, t30);
    			mount_component(upgradebutton1, div6, null);
    			append_dev(div6, t31);
    			mount_component(upgradebutton2, div6, null);
    			append_dev(div6, t32);
    			mount_component(upgradebutton3, div6, null);
    			append_dev(div8, t33);
    			append_dev(div8, div7);
    			mount_component(effectcomponent, div7, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*handleCheeseGenerationInit*/ ctx[30], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty[0] & /*$resource*/ 32) && t1_value !== (t1_value = formatNumber(/*$resource*/ ctx[5].cheese, 2) + "")) set_data_dev(t1, t1_value);
    			if ((!current || dirty[0] & /*cheesePerSecFromQueue*/ 16) && t6_value !== (t6_value = formatNumber(/*cheesePerSecFromQueue*/ ctx[4], 2) + "")) set_data_dev(t6, t6_value);
    			if ((!current || dirty[0] & /*$cheeseCycleCost*/ 512) && t11_value !== (t11_value = formatNumber(/*$cheeseCycleCost*/ ctx[9], 2) + "")) set_data_dev(t11, t11_value);

    			if (!current || dirty[0] & /*$cheeseQueueActive*/ 2) {
    				prop_dev(button, "disabled", /*$cheeseQueueActive*/ ctx[1]);
    			}

    			if (dirty[0] & /*cheeseBarProgress, $cheeseCycleDuration*/ 12 && __progress_last !== (__progress_last = "" + (100 * /*cheeseBarProgress*/ ctx[3] / /*$cheeseCycleDuration*/ ctx[2] + "%"))) {
    				set_style(div, "--progress", __progress_last);
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block0 = if_blocks[current_block_type_index];

    				if (!if_block0) {
    					if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block0.c();
    				} else {
    					if_block0.p(ctx, dirty);
    				}

    				transition_in(if_block0, 1);
    				if_block0.m(div2, null);
    			}

    			if ((!current || dirty[0] & /*$cheeseCycleBatchSize*/ 1) && t17_value !== (t17_value = formatNumber(/*$cheeseCycleBatchSize*/ ctx[0], 2) + "")) set_data_dev(t17, t17_value);

    			if (/*$cheeseModeFactor*/ ctx[11].yield !== 1) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_6(ctx);
    					if_block1.c();
    					if_block1.m(p, t18);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if ((!current || dirty[0] & /*$cheeseCycleDuration*/ 4) && t19_value !== (t19_value = formatTime(/*$cheeseCycleDuration*/ ctx[2] / 1000) + "")) set_data_dev(t19, t19_value);

    			if (/*$cheeseModeFactor*/ ctx[11].duration !== 1) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block_5(ctx);
    					if_block2.c();
    					if_block2.m(p, t20);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if ((!current || dirty[0] & /*$cheeseCycleCost*/ 512) && t22_value !== (t22_value = formatNumber(/*$cheeseCycleCost*/ ctx[9], 2) + "")) set_data_dev(t22, t22_value);

    			if (/*$cheeseModeFactor*/ ctx[11].cost !== 1) {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);
    				} else {
    					if_block3 = create_if_block_4$1(ctx);
    					if_block3.c();
    					if_block3.m(span2, t23);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
    			}

    			if ((!current || dirty[0] & /*$cheeseCycleCost, $cheeseCycleDuration*/ 516) && t24_value !== (t24_value = formatNumber(/*$cheeseCycleCost*/ ctx[9] / /*$cheeseCycleDuration*/ ctx[2] * 1000, 2) + "")) set_data_dev(t24, t24_value);

    			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block4) {
    				if_block4.p(ctx, dirty);
    			} else {
    				if_block4.d(1);
    				if_block4 = current_block_type(ctx);

    				if (if_block4) {
    					if_block4.c();
    					if_block4.m(span3, null);
    				}
    			}

    			if (/*$unlocked*/ ctx[6].cheeseQueueOverclocking || /*$LORCA_OVERRIDE*/ ctx[12]) {
    				if (if_block5) {
    					if_block5.p(ctx, dirty);

    					if (dirty[0] & /*$unlocked, $LORCA_OVERRIDE*/ 4160) {
    						transition_in(if_block5, 1);
    					}
    				} else {
    					if_block5 = create_if_block_1$5(ctx);
    					if_block5.c();
    					transition_in(if_block5, 1);
    					if_block5.m(t28.parentNode, t28);
    				}
    			} else if (if_block5) {
    				group_outros();

    				transition_out(if_block5, 1, 1, () => {
    					if_block5 = null;
    				});

    				check_outros();
    			}

    			const upgradebutton0_changes = {};

    			if (dirty[0] & /*$upgrades, $cheeseCycleBatchSize, $cheeseCycleBaseYield, $cheeseCycleDuration, $cheeseCycleBaseDuration*/ 917509) upgradebutton0_changes.tooltipText = `+${formatNumber((/*$upgrades*/ ctx[17].cheeseYield.bought + 1) * /*$cheeseCycleBatchSize*/ ctx[0] / /*$cheeseCycleBaseYield*/ ctx[18], 2)} 
        cheese per cycle <br>
        +${formatTime(cheeseYieldDeltaDuration * /*$cheeseCycleDuration*/ ctx[2] / /*$cheeseCycleBaseDuration*/ ctx[19] / 1000)} 
        cycle duration <br>(without scaling: +0.5s cycle duration)`;

    			if (dirty[1] & /*$$scope*/ 32768) {
    				upgradebutton0_changes.$$scope = { dirty, ctx };
    			}

    			upgradebutton0.$set(upgradebutton0_changes);
    			const upgradebutton1_changes = {};
    			if (dirty[0] & /*$unlocked*/ 64) upgradebutton1_changes.btnUnlocked = /*$unlocked*/ ctx[6].cheeseQueue;
    			if (dirty[0] & /*$maxCheeseQueue*/ 1024) upgradebutton1_changes.tooltipText = `+${5} capacity <br> Currently: ${/*$maxCheeseQueue*/ ctx[10]}`;

    			if (dirty[1] & /*$$scope*/ 32768) {
    				upgradebutton1_changes.$$scope = { dirty, ctx };
    			}

    			upgradebutton1.$set(upgradebutton1_changes);
    			const upgradebutton2_changes = {};
    			if (dirty[0] & /*$unlocked*/ 64) upgradebutton2_changes.btnUnlocked = /*$unlocked*/ ctx[6].cheeseQueue;
    			if (dirty[0] & /*$upgrades*/ 131072) upgradebutton2_changes.tooltipText = `Currently: ${/*$upgrades*/ ctx[17].cheeseThoughtMult.bought * /*$upgrades*/ ctx[17].cheeseThoughtMult.bought}x <br> Scales ^2 with #upgrades.`;

    			if (dirty[0] & /*$upgrades*/ 131072 | dirty[1] & /*$$scope*/ 32768) {
    				upgradebutton2_changes.$$scope = { dirty, ctx };
    			}

    			upgradebutton2.$set(upgradebutton2_changes);
    			const upgradebutton3_changes = {};
    			if (dirty[0] & /*$unlocked*/ 64) upgradebutton3_changes.btnUnlocked = /*$unlocked*/ ctx[6].cheeseQueueCostDivide;
    			if (dirty[0] & /*$cheeseQueueCostDivideBy*/ 1048576) upgradebutton3_changes.tooltipText = `Current Divisor: ${formatNumber(/*$cheeseQueueCostDivideBy*/ ctx[20], 2)}`;

    			if (dirty[1] & /*$$scope*/ 32768) {
    				upgradebutton3_changes.$$scope = { dirty, ctx };
    			}

    			upgradebutton3.$set(upgradebutton3_changes);
    			const effectcomponent_changes = {};

    			if (dirty[0] & /*$upgrades, $unlocked*/ 131136) effectcomponent_changes.title = /*$upgrades*/ ctx[17].cheeseThoughtMult.bought > 0 || /*$unlocked*/ ctx[6].cheeseQueueLengthBoost
    			? 'Effects'
    			: '???';

    			if (dirty[0] & /*$mcCycleDurationBoostFactor, $unlocked, $cheeseCyclesThoughtMult, $cheeseCycleAcceleratorFactor, $cheeseQueueLengthBoostFactor, $cheeseThoughtMult, $upgrades*/ 65142848 | dirty[1] & /*$$scope*/ 32768) {
    				effectcomponent_changes.$$scope = { dirty, ctx };
    			}

    			effectcomponent.$set(effectcomponent_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(progbar.$$.fragment, local);
    			transition_in(if_block0);

    			add_render_callback(() => {
    				if (!span2_transition) span2_transition = create_bidirectional_transition(span2, fade, { duration: 1000 }, true);
    				span2_transition.run(1);
    			});

    			add_render_callback(() => {
    				if (!span3_transition) span3_transition = create_bidirectional_transition(span3, fade, { duration: 500 }, true);
    				span3_transition.run(1);
    			});

    			transition_in(if_block5);
    			transition_in(unlockdrawer.$$.fragment, local);
    			transition_in(upgradebutton0.$$.fragment, local);
    			transition_in(upgradebutton1.$$.fragment, local);
    			transition_in(upgradebutton2.$$.fragment, local);
    			transition_in(upgradebutton3.$$.fragment, local);
    			transition_in(effectcomponent.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(progbar.$$.fragment, local);
    			transition_out(if_block0);
    			if (!span2_transition) span2_transition = create_bidirectional_transition(span2, fade, { duration: 1000 }, false);
    			span2_transition.run(0);
    			if (!span3_transition) span3_transition = create_bidirectional_transition(span3, fade, { duration: 500 }, false);
    			span3_transition.run(0);
    			transition_out(if_block5);
    			transition_out(unlockdrawer.$$.fragment, local);
    			transition_out(upgradebutton0.$$.fragment, local);
    			transition_out(upgradebutton1.$$.fragment, local);
    			transition_out(upgradebutton2.$$.fragment, local);
    			transition_out(upgradebutton3.$$.fragment, local);
    			transition_out(effectcomponent.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t8);
    			if (detaching) detach_dev(div5);
    			destroy_component(progbar);
    			if_blocks[current_block_type_index].d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    			if (detaching && span2_transition) span2_transition.end();
    			if_block4.d();
    			if (detaching && span3_transition) span3_transition.end();
    			if (detaching) detach_dev(t27);
    			if (if_block5) if_block5.d(detaching);
    			if (detaching) detach_dev(t28);
    			destroy_component(unlockdrawer, detaching);
    			if (detaching) detach_dev(t29);
    			if (detaching) detach_dev(div8);
    			destroy_component(upgradebutton0);
    			destroy_component(upgradebutton1);
    			destroy_component(upgradebutton2);
    			destroy_component(upgradebutton3);
    			destroy_component(effectcomponent);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$4.name,
    		type: "slot",
    		source: "(90:0) <Window title=\\\"Switzerland Simulator\\\" themeColor1=\\\"rgb(168, 143, 2)\\\" themeColor2=\\\"rgb(244, 255, 33)\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let window;
    	let current;

    	window = new Window({
    			props: {
    				title: "Switzerland Simulator",
    				themeColor1: "rgb(168, 143, 2)",
    				themeColor2: "rgb(244, 255, 33)",
    				$$slots: { default: [create_default_slot$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(window.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(window, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const window_changes = {};

    			if (dirty[0] & /*$upgrades, $unlocked, $mcCycleDurationBoostFactor, $cheeseCyclesThoughtMult, $cheeseCycleAcceleratorFactor, $cheeseQueueLengthBoostFactor, $cheeseThoughtMult, $cheeseQueueCostDivideBy, $maxCheeseQueue, $cheeseCycleBatchSize, $cheeseCycleBaseYield, $cheeseCycleDuration, $cheeseCycleBaseDuration, $cheeseFactoryMode, $LORCA_OVERRIDE, $cheeseQueueOverclockLvl, $cheeseCycleBaseCost, $cheeseQueueOverclockSpeedMult, $cheeseQueueTotalCycles, $cheeseCycleCost, $cheeseModeFactor, $currentCheeseQueue, cheeseBarProgress, $cheeseQueueActive, cheesePerSecFromQueue, $resource*/ 67108863 | dirty[1] & /*$$scope*/ 32768) {
    				window_changes.$$scope = { dirty, ctx };
    			}

    			window.$set(window_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(window.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(window.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(window, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const buyMaxUpgrades$2 = false;

    function instance$9($$self, $$props, $$invalidate) {
    	let cheesePerSecFromQueue;
    	let $mcByproductAmount;
    	let $resource;
    	let $moldyCheeseChance;
    	let $unlocked;
    	let $cheeseQueueTotalCycles;
    	let $currentCheeseQueue;
    	let $cheeseCycleCost;
    	let $cheeseCycleBatchSize;
    	let $cheeseQueueActive;
    	let $cheeseCycleDuration;
    	let $maxCheeseQueue;
    	let $cheeseModeFactor;
    	let $LORCA_OVERRIDE;
    	let $cheeseQueueOverclockLvl;
    	let $cheeseQueueOverclockSpeedMult;
    	let $cheeseCycleBaseCost;
    	let $cheeseFactoryMode;
    	let $upgrades;
    	let $cheeseCycleBaseYield;
    	let $cheeseCycleBaseDuration;
    	let $cheeseQueueCostDivideBy;
    	let $cheeseThoughtMult;
    	let $cheeseQueueLengthBoostFactor;
    	let $cheeseCycleAcceleratorFactor;
    	let $cheeseCyclesThoughtMult;
    	let $mcCycleDurationBoostFactor;
    	validate_store(mcByproductAmount, 'mcByproductAmount');
    	component_subscribe($$self, mcByproductAmount, $$value => $$invalidate(42, $mcByproductAmount = $$value));
    	validate_store(resource, 'resource');
    	component_subscribe($$self, resource, $$value => $$invalidate(5, $resource = $$value));
    	validate_store(moldyCheeseChance, 'moldyCheeseChance');
    	component_subscribe($$self, moldyCheeseChance, $$value => $$invalidate(43, $moldyCheeseChance = $$value));
    	validate_store(unlocked, 'unlocked');
    	component_subscribe($$self, unlocked, $$value => $$invalidate(6, $unlocked = $$value));
    	validate_store(cheeseQueueTotalCycles, 'cheeseQueueTotalCycles');
    	component_subscribe($$self, cheeseQueueTotalCycles, $$value => $$invalidate(7, $cheeseQueueTotalCycles = $$value));
    	validate_store(currentCheeseQueue, 'currentCheeseQueue');
    	component_subscribe($$self, currentCheeseQueue, $$value => $$invalidate(8, $currentCheeseQueue = $$value));
    	validate_store(cheeseCycleCost, 'cheeseCycleCost');
    	component_subscribe($$self, cheeseCycleCost, $$value => $$invalidate(9, $cheeseCycleCost = $$value));
    	validate_store(cheeseCycleBatchSize, 'cheeseCycleBatchSize');
    	component_subscribe($$self, cheeseCycleBatchSize, $$value => $$invalidate(0, $cheeseCycleBatchSize = $$value));
    	validate_store(cheeseQueueActive, 'cheeseQueueActive');
    	component_subscribe($$self, cheeseQueueActive, $$value => $$invalidate(1, $cheeseQueueActive = $$value));
    	validate_store(cheeseCycleDuration, 'cheeseCycleDuration');
    	component_subscribe($$self, cheeseCycleDuration, $$value => $$invalidate(2, $cheeseCycleDuration = $$value));
    	validate_store(maxCheeseQueue, 'maxCheeseQueue');
    	component_subscribe($$self, maxCheeseQueue, $$value => $$invalidate(10, $maxCheeseQueue = $$value));
    	validate_store(cheeseModeFactor, 'cheeseModeFactor');
    	component_subscribe($$self, cheeseModeFactor, $$value => $$invalidate(11, $cheeseModeFactor = $$value));
    	validate_store(LORCA_OVERRIDE, 'LORCA_OVERRIDE');
    	component_subscribe($$self, LORCA_OVERRIDE, $$value => $$invalidate(12, $LORCA_OVERRIDE = $$value));
    	validate_store(cheeseQueueOverclockLvl, 'cheeseQueueOverclockLvl');
    	component_subscribe($$self, cheeseQueueOverclockLvl, $$value => $$invalidate(13, $cheeseQueueOverclockLvl = $$value));
    	validate_store(cheeseQueueOverclockSpeedMult, 'cheeseQueueOverclockSpeedMult');
    	component_subscribe($$self, cheeseQueueOverclockSpeedMult, $$value => $$invalidate(14, $cheeseQueueOverclockSpeedMult = $$value));
    	validate_store(cheeseFactoryMode, 'cheeseFactoryMode');
    	component_subscribe($$self, cheeseFactoryMode, $$value => $$invalidate(16, $cheeseFactoryMode = $$value));
    	validate_store(upgrades, 'upgrades');
    	component_subscribe($$self, upgrades, $$value => $$invalidate(17, $upgrades = $$value));
    	validate_store(cheeseQueueCostDivideBy, 'cheeseQueueCostDivideBy');
    	component_subscribe($$self, cheeseQueueCostDivideBy, $$value => $$invalidate(20, $cheeseQueueCostDivideBy = $$value));
    	validate_store(cheeseThoughtMult, 'cheeseThoughtMult');
    	component_subscribe($$self, cheeseThoughtMult, $$value => $$invalidate(21, $cheeseThoughtMult = $$value));
    	validate_store(cheeseQueueLengthBoostFactor, 'cheeseQueueLengthBoostFactor');
    	component_subscribe($$self, cheeseQueueLengthBoostFactor, $$value => $$invalidate(22, $cheeseQueueLengthBoostFactor = $$value));
    	validate_store(cheeseCycleAcceleratorFactor, 'cheeseCycleAcceleratorFactor');
    	component_subscribe($$self, cheeseCycleAcceleratorFactor, $$value => $$invalidate(23, $cheeseCycleAcceleratorFactor = $$value));
    	validate_store(cheeseCyclesThoughtMult, 'cheeseCyclesThoughtMult');
    	component_subscribe($$self, cheeseCyclesThoughtMult, $$value => $$invalidate(24, $cheeseCyclesThoughtMult = $$value));
    	validate_store(mcCycleDurationBoostFactor, 'mcCycleDurationBoostFactor');
    	component_subscribe($$self, mcCycleDurationBoostFactor, $$value => $$invalidate(25, $mcCycleDurationBoostFactor = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CheeseComponent', slots, []);
    	const cheeseCycleBaseYield = cheeseCycleBase.yield;
    	validate_store(cheeseCycleBaseYield, 'cheeseCycleBaseYield');
    	component_subscribe($$self, cheeseCycleBaseYield, value => $$invalidate(18, $cheeseCycleBaseYield = value));
    	const cheeseCycleBaseDuration = cheeseCycleBase.duration;
    	validate_store(cheeseCycleBaseDuration, 'cheeseCycleBaseDuration');
    	component_subscribe($$self, cheeseCycleBaseDuration, value => $$invalidate(19, $cheeseCycleBaseDuration = value));
    	const cheeseCycleBaseCost = cheeseCycleBase.cost;
    	validate_store(cheeseCycleBaseCost, 'cheeseCycleBaseCost');
    	component_subscribe($$self, cheeseCycleBaseCost, value => $$invalidate(15, $cheeseCycleBaseCost = value));
    	let cheeseBarProgress = 0;
    	let lastTime = null;

    	onMount(() => {
    		if ($cheeseQueueActive) requestAnimationFrame(animateCheeseBar);
    	});

    	function resetCheeseBar() {
    		$$invalidate(3, cheeseBarProgress = 0);
    	}

    	/**
     * Triggered when manually starting the cheese generation (with button or input range)
     */
    	function handleCheeseGenerationInit() {
    		if ($resource.thoughts < $cheeseCycleCost || $cheeseQueueActive) return;
    		set_store_value(resource, $resource.thoughts -= $cheeseCycleCost, $resource);
    		if ($currentCheeseQueue >= 1) set_store_value(currentCheeseQueue, $currentCheeseQueue--, $currentCheeseQueue);
    		cheeseQueueActive.set(true);
    		lastTime = null;

    		/* TODO: insert here logic for if cheeseCycleBaseDuration exceeds a certain speed, then no animation, just a static bar with
    statistical averages for calculations */
    		requestAnimationFrame(animateCheeseBar);
    	}

    	function animateCheeseBar(currentTime) {
    		if (lastTime === null) lastTime = currentTime;
    		const deltaTimeMillis = Math.max(Math.min(currentTime - lastTime), 0);
    		lastTime = currentTime;

    		// the value of cheeseBarProgress is fed to CSS
    		$$invalidate(3, cheeseBarProgress += deltaTimeMillis);

    		while (cheeseBarProgress >= $cheeseCycleDuration) {
    			handleCheeseGeneration();

    			// console.log('Completed a cycle with ' + $cheeseCycleDuration, cheeseBarProgress)
    			$$invalidate(3, cheeseBarProgress -= $cheeseCycleDuration);

    			if (cheeseBarProgress < $cheeseCycleDuration) $$invalidate(3, cheeseBarProgress = 0);
    		}

    		if ($cheeseQueueActive) requestAnimationFrame(animateCheeseBar);
    	}

    	/**
     * This function shall be called whenever the cheese bar completes a cycle.
     */
    	function handleCheeseGeneration() {
    		set_store_value(resource, $resource.cheese += $cheeseCycleBatchSize, $resource);

    		if (!$currentCheeseQueue) {
    			// 'initial' better than 'paused', because the animation might've already started a small bit
    			cheeseQueueActive.set(false);

    			return;
    		}

    		if ($resource.thoughts < $cheeseCycleCost) {
    			cheeseQueueActive.set(false);
    			return;
    		}

    		set_store_value(resource, $resource.thoughts -= $cheeseCycleCost, $resource);
    		if ($currentCheeseQueue >= 1) set_store_value(currentCheeseQueue, $currentCheeseQueue--, $currentCheeseQueue);
    		set_store_value(cheeseQueueTotalCycles, $cheeseQueueTotalCycles++, $cheeseQueueTotalCycles);

    		// HANDLEMOLDY CHEESE
    		if ($unlocked.moldyCheeseByproduct) {
    			if (Math.random() < $moldyCheeseChance) {
    				set_store_value(resource, $resource.moldyCheese += $mcByproductAmount, $resource);
    			}
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<CheeseComponent> was created with unknown prop '${key}'`);
    	});

    	const $$binding_groups = [[]];

    	function inputrange_value_binding(value) {
    		$currentCheeseQueue = value;
    		currentCheeseQueue.set($currentCheeseQueue);
    	}

    	const click_handler = () => set_store_value(cheeseQueueOverclockLvl, $cheeseQueueOverclockLvl++, $cheeseQueueOverclockLvl);
    	const click_handler_1 = () => set_store_value(cheeseQueueOverclockLvl, $cheeseQueueOverclockLvl--, $cheeseQueueOverclockLvl);

    	function input0_change_handler() {
    		$cheeseFactoryMode = this.__value;
    		cheeseFactoryMode.set($cheeseFactoryMode);
    	}

    	function input1_change_handler() {
    		$cheeseFactoryMode = this.__value;
    		cheeseFactoryMode.set($cheeseFactoryMode);
    	}

    	function input2_change_handler() {
    		$cheeseFactoryMode = this.__value;
    		cheeseFactoryMode.set($cheeseFactoryMode);
    	}

    	const func = v => v.name === UnlockName.CHEESE_QUEUE_LENGTH_BOOST;
    	const func_1 = v => v.name === UnlockName.CHEESE_CYCLE_ACCELERATOR;
    	const func_2 = v => v.name === UnlockName.CHEESE_CYCLES_BOOST_THOUGHTS;

    	$$self.$capture_state = () => ({
    		Window,
    		EffectComponent,
    		Effect,
    		formatNumber,
    		formatTime,
    		formatWhole,
    		fade,
    		slide,
    		ProgBar,
    		UpgradeButton,
    		InputRange,
    		LORCA_OVERRIDE,
    		resource,
    		upgrades,
    		unlocked,
    		currentCheeseQueue,
    		cheeseQueueOverclockLvl,
    		cheeseFactoryMode,
    		cheeseQueueTotalCycles,
    		currentThoughtBoost,
    		cheeseModeFactor,
    		cheeseCycleDuration,
    		cheeseCycleBatchSize,
    		cheeseCycleCost,
    		cheeseQueueCostDivideBy,
    		cheeseCycleBase,
    		cheeseQueueActive,
    		cheeseQueueOverclockSpeedMult,
    		maxCheeseQueue,
    		cheeseYieldDeltaDuration,
    		cheeseQueueLengthBoostFactor,
    		cheeseCycleAcceleratorFactor,
    		cheeseThoughtMult,
    		cheeseCyclesThoughtMult,
    		unlocks,
    		UnlockName,
    		mcCycleDurationBoostFactor,
    		moldyCheeseChance,
    		mcByproductAmount,
    		UnlockDrawer,
    		tooltip,
    		CheeseFactoryProtocol,
    		onMount,
    		buyMaxUpgrades: buyMaxUpgrades$2,
    		cheeseCycleBaseYield,
    		cheeseCycleBaseDuration,
    		cheeseCycleBaseCost,
    		cheeseBarProgress,
    		lastTime,
    		resetCheeseBar,
    		handleCheeseGenerationInit,
    		animateCheeseBar,
    		handleCheeseGeneration,
    		cheesePerSecFromQueue,
    		$mcByproductAmount,
    		$resource,
    		$moldyCheeseChance,
    		$unlocked,
    		$cheeseQueueTotalCycles,
    		$currentCheeseQueue,
    		$cheeseCycleCost,
    		$cheeseCycleBatchSize,
    		$cheeseQueueActive,
    		$cheeseCycleDuration,
    		$maxCheeseQueue,
    		$cheeseModeFactor,
    		$LORCA_OVERRIDE,
    		$cheeseQueueOverclockLvl,
    		$cheeseQueueOverclockSpeedMult,
    		$cheeseCycleBaseCost,
    		$cheeseFactoryMode,
    		$upgrades,
    		$cheeseCycleBaseYield,
    		$cheeseCycleBaseDuration,
    		$cheeseQueueCostDivideBy,
    		$cheeseThoughtMult,
    		$cheeseQueueLengthBoostFactor,
    		$cheeseCycleAcceleratorFactor,
    		$cheeseCyclesThoughtMult,
    		$mcCycleDurationBoostFactor
    	});

    	$$self.$inject_state = $$props => {
    		if ('cheeseBarProgress' in $$props) $$invalidate(3, cheeseBarProgress = $$props.cheeseBarProgress);
    		if ('lastTime' in $$props) lastTime = $$props.lastTime;
    		if ('cheesePerSecFromQueue' in $$props) $$invalidate(4, cheesePerSecFromQueue = $$props.cheesePerSecFromQueue);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*$cheeseQueueActive, $cheeseCycleBatchSize, $cheeseCycleDuration*/ 7) {
    			// 1 if it's active, 0 when not
    			// $: cheeseQueueActive = cheeseCycleBase.state === 'running'
    			$$invalidate(4, cheesePerSecFromQueue = +$cheeseQueueActive * 1000 * ($cheeseCycleBatchSize / $cheeseCycleDuration));
    		}
    	};

    	return [
    		$cheeseCycleBatchSize,
    		$cheeseQueueActive,
    		$cheeseCycleDuration,
    		cheeseBarProgress,
    		cheesePerSecFromQueue,
    		$resource,
    		$unlocked,
    		$cheeseQueueTotalCycles,
    		$currentCheeseQueue,
    		$cheeseCycleCost,
    		$maxCheeseQueue,
    		$cheeseModeFactor,
    		$LORCA_OVERRIDE,
    		$cheeseQueueOverclockLvl,
    		$cheeseQueueOverclockSpeedMult,
    		$cheeseCycleBaseCost,
    		$cheeseFactoryMode,
    		$upgrades,
    		$cheeseCycleBaseYield,
    		$cheeseCycleBaseDuration,
    		$cheeseQueueCostDivideBy,
    		$cheeseThoughtMult,
    		$cheeseQueueLengthBoostFactor,
    		$cheeseCycleAcceleratorFactor,
    		$cheeseCyclesThoughtMult,
    		$mcCycleDurationBoostFactor,
    		cheeseCycleBaseYield,
    		cheeseCycleBaseDuration,
    		cheeseCycleBaseCost,
    		resetCheeseBar,
    		handleCheeseGenerationInit,
    		inputrange_value_binding,
    		click_handler,
    		click_handler_1,
    		input0_change_handler,
    		$$binding_groups,
    		input1_change_handler,
    		input2_change_handler,
    		func,
    		func_1,
    		func_2
    	];
    }

    class CheeseComponent extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {}, null, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CheeseComponent",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    /* src/components/game-windows/MoldyCheeseComponent.svelte generated by Svelte v3.44.1 */
    const file$8 = "src/components/game-windows/MoldyCheeseComponent.svelte";

    // (53:6) {:else}
    function create_else_block$1(ctx) {
    	let t0;
    	let br;
    	let t1;

    	const block = {
    		c: function create() {
    			t0 = text("...???\n        ");
    			br = element("br");
    			t1 = text("\n        ...???");
    			attr_dev(br, "class", "svelte-2rvodi");
    			add_location(br, file$8, 54, 8, 2378);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, br, anchor);
    			insert_dev(target, t1, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(br);
    			if (detaching) detach_dev(t1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(53:6) {:else}",
    		ctx
    	});

    	return block;
    }

    // (46:6) {#if $unlocked.moldyCheeseByproduct || $LORCA_OVERRIDE}
    function create_if_block_1$4(ctx) {
    	let t0;
    	let t1_value = formatNumber(/*$mcByproductAmount*/ ctx[8], 2) + "";
    	let t1;
    	let t2;
    	let t3;
    	let br;
    	let t4;
    	let t5_value = formatNumber(/*$mcByproductAmount*/ ctx[8] / (/*$cheeseCycleDuration*/ ctx[10] / 1000) * /*$moldyCheeseChance*/ ctx[9], 2) + "";
    	let t5;
    	let t6;
    	let if_block = /*$moldyCheeseChance*/ ctx[9] !== 1 && create_if_block_2$3(ctx);

    	const block = {
    		c: function create() {
    			t0 = text("You gain ");
    			t1 = text(t1_value);
    			t2 = text(" moldy cheese\n        ");
    			if (if_block) if_block.c();
    			t3 = text("\n        whenever a cheese cycle completes\n        ");
    			br = element("br");
    			t4 = text("\n        Estimated rate: ");
    			t5 = text(t5_value);
    			t6 = text(" moldy\n        cheese/s");
    			attr_dev(br, "class", "svelte-2rvodi");
    			add_location(br, file$8, 49, 8, 2194);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, t2, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, br, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, t6, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$mcByproductAmount*/ 256 && t1_value !== (t1_value = formatNumber(/*$mcByproductAmount*/ ctx[8], 2) + "")) set_data_dev(t1, t1_value);

    			if (/*$moldyCheeseChance*/ ctx[9] !== 1) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_2$3(ctx);
    					if_block.c();
    					if_block.m(t3.parentNode, t3);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*$mcByproductAmount, $cheeseCycleDuration, $moldyCheeseChance*/ 1792 && t5_value !== (t5_value = formatNumber(/*$mcByproductAmount*/ ctx[8] / (/*$cheeseCycleDuration*/ ctx[10] / 1000) * /*$moldyCheeseChance*/ ctx[9], 2) + "")) set_data_dev(t5, t5_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(t2);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(br);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(t6);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(46:6) {#if $unlocked.moldyCheeseByproduct || $LORCA_OVERRIDE}",
    		ctx
    	});

    	return block;
    }

    // (48:8) {#if $moldyCheeseChance !== 1}
    function create_if_block_2$3(ctx) {
    	let t0;
    	let t1_value = formatWhole(/*$moldyCheeseChance*/ ctx[9] * 100) + "";
    	let t1;
    	let t2;

    	const block = {
    		c: function create() {
    			t0 = text("with a ");
    			t1 = text(t1_value);
    			t2 = text("% chance");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, t2, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$moldyCheeseChance*/ 512 && t1_value !== (t1_value = formatWhole(/*$moldyCheeseChance*/ ctx[9] * 100) + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(t2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$3.name,
    		type: "if",
    		source: "(48:8) {#if $moldyCheeseChance !== 1}",
    		ctx
    	});

    	return block;
    }

    // (68:4) {#if conversionOnCD}
    function create_if_block$4(ctx) {
    	let span;
    	let t0;
    	let t1_value = formatNumber(/*cdTimer*/ ctx[1] / 1000, 1) + "";
    	let t1;
    	let t2;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t0 = text("(");
    			t1 = text(t1_value);
    			t2 = text("s)");
    			attr_dev(span, "class", "svelte-2rvodi");
    			add_location(span, file$8, 68, 6, 2823);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t0);
    			append_dev(span, t1);
    			append_dev(span, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*cdTimer*/ 2 && t1_value !== (t1_value = formatNumber(/*cdTimer*/ ctx[1] / 1000, 1) + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(68:4) {#if conversionOnCD}",
    		ctx
    	});

    	return block;
    }

    // (77:6) <UpgradeButton         upgradeName="moldyCheeseConversionExponent"         {buyMaxUpgrades}         tooltipText={`Currently: cheese^${formatNumber($mcConversionExponent, 4)}`}       >
    function create_default_slot_7$1(ctx) {
    	let t;
    	let br;

    	const block = {
    		c: function create() {
    			t = text("Improve the conversion function ");
    			br = element("br");
    			attr_dev(br, "class", "svelte-2rvodi");
    			add_location(br, file$8, 81, 40, 3289);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    			insert_dev(target, br, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(br);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7$1.name,
    		type: "slot",
    		source: "(77:6) <UpgradeButton         upgradeName=\\\"moldyCheeseConversionExponent\\\"         {buyMaxUpgrades}         tooltipText={`Currently: cheese^${formatNumber($mcConversionExponent, 4)}`}       >",
    		ctx
    	});

    	return block;
    }

    // (85:6) <UpgradeButton         upgradeName="moldyCheeseHalfLife"         {buyMaxUpgrades}         tooltipText={`+10s half-life <br> Currently: ${formatWhole($mcHalfLifeSeconds)}s`}       >
    function create_default_slot_6$1(ctx) {
    	let t;
    	let br;

    	const block = {
    		c: function create() {
    			t = text("Increase MC half-life ");
    			br = element("br");
    			attr_dev(br, "class", "svelte-2rvodi");
    			add_location(br, file$8, 89, 30, 3537);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    			insert_dev(target, br, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(br);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6$1.name,
    		type: "slot",
    		source: "(85:6) <UpgradeButton         upgradeName=\\\"moldyCheeseHalfLife\\\"         {buyMaxUpgrades}         tooltipText={`+10s half-life <br> Currently: ${formatWhole($mcHalfLifeSeconds)}s`}       >",
    		ctx
    	});

    	return block;
    }

    // (93:6) <UpgradeButton         upgradeName="moldyCheeseChance"         {buyMaxUpgrades}         btnUnlocked={$unlocked.moldyCheeseByproduct}         tooltipText={`+10% chance (additive) <br> Currently: ${formatNumber($moldyCheeseChance * 100, 1)}%`}       >
    function create_default_slot_5$1(ctx) {
    	let t;
    	let br;

    	const block = {
    		c: function create() {
    			t = text("Increase MC byproduct chance ");
    			br = element("br");
    			attr_dev(br, "class", "svelte-2rvodi");
    			add_location(br, file$8, 98, 37, 3861);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    			insert_dev(target, br, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(br);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5$1.name,
    		type: "slot",
    		source: "(93:6) <UpgradeButton         upgradeName=\\\"moldyCheeseChance\\\"         {buyMaxUpgrades}         btnUnlocked={$unlocked.moldyCheeseByproduct}         tooltipText={`+10% chance (additive) <br> Currently: ${formatNumber($moldyCheeseChance * 100, 1)}%`}       >",
    		ctx
    	});

    	return block;
    }

    // (102:6) <UpgradeButton         upgradeName="cheeseMonsterSpawnrate"         {buyMaxUpgrades}         btnUnlocked={$unlocked.cheeseyard}         tooltipText={$cheeseMonsterSpawnrate < 1           ? `+${formatWhole(20)} spawns/min <br> Currently: ${formatWhole($cheeseMonsterSpawnrate * 60)} spawns/min`           : `+${formatNumber(20 / 60, 2)} spawns/s <br> Currently: ${formatNumber(               $cheeseMonsterSpawnrate,               2             )} spawns/s`}       >
    function create_default_slot_4$1(ctx) {
    	let t;
    	let br;

    	const block = {
    		c: function create() {
    			t = text("Improve the spawn rate in the cheeseyard ");
    			br = element("br");
    			attr_dev(br, "class", "svelte-2rvodi");
    			add_location(br, file$8, 112, 49, 4413);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    			insert_dev(target, br, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(br);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$1.name,
    		type: "slot",
    		source: "(102:6) <UpgradeButton         upgradeName=\\\"cheeseMonsterSpawnrate\\\"         {buyMaxUpgrades}         btnUnlocked={$unlocked.cheeseyard}         tooltipText={$cheeseMonsterSpawnrate < 1           ? `+${formatWhole(20)} spawns/min <br> Currently: ${formatWhole($cheeseMonsterSpawnrate * 60)} spawns/min`           : `+${formatNumber(20 / 60, 2)} spawns/s <br> Currently: ${formatNumber(               $cheeseMonsterSpawnrate,               2             )} spawns/s`}       >",
    		ctx
    	});

    	return block;
    }

    // (116:6) <UpgradeButton         upgradeName="cheeseMonsterCapacity"         {buyMaxUpgrades}         btnUnlocked={$unlocked.cheeseyard}         tooltipText={`+10 capacity <br> Currently: ${formatWhole($cheeseMonsterCapacity)}`}       >
    function create_default_slot_3$1(ctx) {
    	let t;
    	let br;

    	const block = {
    		c: function create() {
    			t = text("Expand the Cheeseyard ");
    			br = element("br");
    			attr_dev(br, "class", "svelte-2rvodi");
    			add_location(br, file$8, 121, 30, 4707);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    			insert_dev(target, br, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(br);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$1.name,
    		type: "slot",
    		source: "(116:6) <UpgradeButton         upgradeName=\\\"cheeseMonsterCapacity\\\"         {buyMaxUpgrades}         btnUnlocked={$unlocked.cheeseyard}         tooltipText={`+10 capacity <br> Currently: ${formatWhole($cheeseMonsterCapacity)}`}       >",
    		ctx
    	});

    	return block;
    }

    // (128:8) <Effect           factor={$mcHalflifeBoostFactor}           unlocked={$unlocked.moldyCheeseHalflifeBoost}           tooltipText={`Scales ^${3} with half life.`}         >
    function create_default_slot_2$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Cheese gain is additionally boosted by MC half-life");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$1.name,
    		type: "slot",
    		source: "(128:8) <Effect           factor={$mcHalflifeBoostFactor}           unlocked={$unlocked.moldyCheeseHalflifeBoost}           tooltipText={`Scales ^${3} with half life.`}         >",
    		ctx
    	});

    	return block;
    }

    // (127:6) <EffectComponent>
    function create_default_slot_1$1(ctx) {
    	let effect;
    	let current;

    	effect = new Effect({
    			props: {
    				factor: /*$mcHalflifeBoostFactor*/ ctx[14],
    				unlocked: /*$unlocked*/ ctx[6].moldyCheeseHalflifeBoost,
    				tooltipText: `Scales ^${3} with half life.`,
    				$$slots: { default: [create_default_slot_2$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(effect.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(effect, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const effect_changes = {};
    			if (dirty & /*$mcHalflifeBoostFactor*/ 16384) effect_changes.factor = /*$mcHalflifeBoostFactor*/ ctx[14];
    			if (dirty & /*$unlocked*/ 64) effect_changes.unlocked = /*$unlocked*/ ctx[6].moldyCheeseHalflifeBoost;

    			if (dirty & /*$$scope*/ 131072) {
    				effect_changes.$$scope = { dirty, ctx };
    			}

    			effect.$set(effect_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(effect.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(effect.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(effect, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(127:6) <EffectComponent>",
    		ctx
    	});

    	return block;
    }

    // (34:0) <Window title="Moldy Cheese" themeColor1="rgb(75, 121, 0)" themeColor2="rgb(136, 255, 0)">
    function create_default_slot$3(ctx) {
    	let div0;
    	let span0;
    	let t0;
    	let t1_value = formatNumber(/*$resource*/ ctx[2].moldyCheese, 2) + "";
    	let t1;
    	let t2;
    	let strong0;
    	let t4;
    	let br0;
    	let t5;
    	let span1;
    	let t6;
    	let t7_value = formatWhole(/*$mcHalfLifeSeconds*/ ctx[5]) + "";
    	let t7;
    	let t8;
    	let t9_value = formatNumber(100 - 100 * (1 - Math.log(2) / /*$mcHalfLifeSeconds*/ ctx[5]), 2) + "";
    	let t9;
    	let t10;
    	let br1;
    	let t11;
    	let br2;
    	let t12;
    	let t13;
    	let button;
    	let strong1;
    	let t15;
    	let br3;
    	let t16;
    	let br4;
    	let t17;
    	let t18_value = formatNumber(/*$mcManualConversionAmount*/ ctx[3], 2) + "";
    	let t18;
    	let t19;
    	let br5;
    	let t20;
    	let span2;
    	let t21;
    	let t22_value = formatWhole(/*$mcConversionCooldownMS*/ ctx[4] / 1000) + "";
    	let t22;
    	let t23;
    	let t24;
    	let t25;
    	let unlockdrawer;
    	let t26;
    	let div3;
    	let div1;
    	let upgradebutton0;
    	let t27;
    	let upgradebutton1;
    	let t28;
    	let upgradebutton2;
    	let t29;
    	let upgradebutton3;
    	let t30;
    	let upgradebutton4;
    	let t31;
    	let div2;
    	let effectcomponent;
    	let current;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*$unlocked*/ ctx[6].moldyCheeseByproduct || /*$LORCA_OVERRIDE*/ ctx[7]) return create_if_block_1$4;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type(ctx);
    	let if_block1 = /*conversionOnCD*/ ctx[0] && create_if_block$4(ctx);

    	unlockdrawer = new UnlockDrawer({
    			props: {
    				unlocks: unlocks.moldyCheese,
    				folderName: "Free Alchemical Ingredient Icons Pack"
    			},
    			$$inline: true
    		});

    	upgradebutton0 = new UpgradeButton({
    			props: {
    				upgradeName: "moldyCheeseConversionExponent",
    				buyMaxUpgrades: buyMaxUpgrades$1,
    				tooltipText: `Currently: cheese^${formatNumber(/*$mcConversionExponent*/ ctx[11], 4)}`,
    				$$slots: { default: [create_default_slot_7$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	upgradebutton1 = new UpgradeButton({
    			props: {
    				upgradeName: "moldyCheeseHalfLife",
    				buyMaxUpgrades: buyMaxUpgrades$1,
    				tooltipText: `+10s half-life <br> Currently: ${formatWhole(/*$mcHalfLifeSeconds*/ ctx[5])}s`,
    				$$slots: { default: [create_default_slot_6$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	upgradebutton2 = new UpgradeButton({
    			props: {
    				upgradeName: "moldyCheeseChance",
    				buyMaxUpgrades: buyMaxUpgrades$1,
    				btnUnlocked: /*$unlocked*/ ctx[6].moldyCheeseByproduct,
    				tooltipText: `+10% chance (additive) <br> Currently: ${formatNumber(/*$moldyCheeseChance*/ ctx[9] * 100, 1)}%`,
    				$$slots: { default: [create_default_slot_5$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	upgradebutton3 = new UpgradeButton({
    			props: {
    				upgradeName: "cheeseMonsterSpawnrate",
    				buyMaxUpgrades: buyMaxUpgrades$1,
    				btnUnlocked: /*$unlocked*/ ctx[6].cheeseyard,
    				tooltipText: /*$cheeseMonsterSpawnrate*/ ctx[12] < 1
    				? `+${formatWhole(20)} spawns/min <br> Currently: ${formatWhole(/*$cheeseMonsterSpawnrate*/ ctx[12] * 60)} spawns/min`
    				: `+${formatNumber(20 / 60, 2)} spawns/s <br> Currently: ${formatNumber(/*$cheeseMonsterSpawnrate*/ ctx[12], 2)} spawns/s`,
    				$$slots: { default: [create_default_slot_4$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	upgradebutton4 = new UpgradeButton({
    			props: {
    				upgradeName: "cheeseMonsterCapacity",
    				buyMaxUpgrades: buyMaxUpgrades$1,
    				btnUnlocked: /*$unlocked*/ ctx[6].cheeseyard,
    				tooltipText: `+10 capacity <br> Currently: ${formatWhole(/*$cheeseMonsterCapacity*/ ctx[13])}`,
    				$$slots: { default: [create_default_slot_3$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	effectcomponent = new EffectComponent({
    			props: {
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			span0 = element("span");
    			t0 = text("You have ");
    			t1 = text(t1_value);
    			t2 = space();
    			strong0 = element("strong");
    			strong0.textContent = "moldy cheese";
    			t4 = space();
    			br0 = element("br");
    			t5 = space();
    			span1 = element("span");
    			t6 = text("Half-life: ");
    			t7 = text(t7_value);
    			t8 = text("s (-");
    			t9 = text(t9_value);
    			t10 = text("%/s) ");
    			br1 = element("br");
    			t11 = text("\n      (Moldy cheese is an unstable isotope of cheese and can decay) ");
    			br2 = element("br");
    			t12 = space();
    			if_block0.c();
    			t13 = space();
    			button = element("button");
    			strong1 = element("strong");
    			strong1.textContent = "Cheese Sacrifice";
    			t15 = space();
    			br3 = element("br");
    			t16 = text("\n    Convert all cheese into");
    			br4 = element("br");
    			t17 = space();
    			t18 = text(t18_value);
    			t19 = text(" moldy cheese\n    ");
    			br5 = element("br");
    			t20 = space();
    			span2 = element("span");
    			t21 = text("Cooldown: ");
    			t22 = text(t22_value);
    			t23 = text("s");
    			t24 = space();
    			if (if_block1) if_block1.c();
    			t25 = space();
    			create_component(unlockdrawer.$$.fragment);
    			t26 = space();
    			div3 = element("div");
    			div1 = element("div");
    			create_component(upgradebutton0.$$.fragment);
    			t27 = space();
    			create_component(upgradebutton1.$$.fragment);
    			t28 = space();
    			create_component(upgradebutton2.$$.fragment);
    			t29 = space();
    			create_component(upgradebutton3.$$.fragment);
    			t30 = space();
    			create_component(upgradebutton4.$$.fragment);
    			t31 = space();
    			div2 = element("div");
    			create_component(effectcomponent.$$.fragment);
    			attr_dev(strong0, "class", "colorText svelte-2rvodi");
    			add_location(strong0, file$8, 36, 56, 1596);
    			attr_dev(br0, "class", "svelte-2rvodi");
    			add_location(br0, file$8, 37, 6, 1650);
    			attr_dev(span0, "class", "resourceDisplay svelte-2rvodi");
    			add_location(span0, file$8, 35, 4, 1509);
    			attr_dev(br1, "class", "svelte-2rvodi");
    			add_location(br1, file$8, 43, 13, 1832);
    			attr_dev(br2, "class", "svelte-2rvodi");
    			add_location(br2, file$8, 44, 68, 1907);
    			attr_dev(span1, "class", "svelte-2rvodi");
    			add_location(span1, file$8, 39, 4, 1673);
    			set_style(div0, "display", "flex");
    			set_style(div0, "flex-direction", "column");
    			set_style(div0, "gap", "8px");
    			attr_dev(div0, "class", "svelte-2rvodi");
    			add_location(div0, file$8, 34, 2, 1442);
    			set_style(strong1, "color", "yellow");
    			attr_dev(strong1, "class", "svelte-2rvodi");
    			add_location(strong1, file$8, 61, 4, 2543);
    			attr_dev(br3, "class", "svelte-2rvodi");
    			add_location(br3, file$8, 62, 4, 2602);
    			attr_dev(br4, "class", "svelte-2rvodi");
    			add_location(br4, file$8, 63, 27, 2636);
    			attr_dev(br5, "class", "svelte-2rvodi");
    			add_location(br5, file$8, 65, 4, 2709);
    			attr_dev(span2, "class", "svelte-2rvodi");
    			add_location(span2, file$8, 66, 4, 2720);
    			set_style(button, "width", "250px");
    			button.disabled = /*conversionOnCD*/ ctx[0];
    			attr_dev(button, "class", "svelte-2rvodi");
    			add_location(button, file$8, 60, 2, 2436);
    			attr_dev(div1, "class", "gridColumn svelte-2rvodi");
    			add_location(div1, file$8, 75, 4, 3034);
    			attr_dev(div2, "class", "gridColumn svelte-2rvodi");
    			set_style(div2, "height", "332px");
    			set_style(div2, "width", "100%");
    			add_location(div2, file$8, 125, 4, 4753);
    			attr_dev(div3, "class", "flexRowContainer svelte-2rvodi");
    			add_location(div3, file$8, 74, 2, 2999);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, span0);
    			append_dev(span0, t0);
    			append_dev(span0, t1);
    			append_dev(span0, t2);
    			append_dev(span0, strong0);
    			append_dev(span0, t4);
    			append_dev(span0, br0);
    			append_dev(div0, t5);
    			append_dev(div0, span1);
    			append_dev(span1, t6);
    			append_dev(span1, t7);
    			append_dev(span1, t8);
    			append_dev(span1, t9);
    			append_dev(span1, t10);
    			append_dev(span1, br1);
    			append_dev(span1, t11);
    			append_dev(span1, br2);
    			append_dev(span1, t12);
    			if_block0.m(span1, null);
    			insert_dev(target, t13, anchor);
    			insert_dev(target, button, anchor);
    			append_dev(button, strong1);
    			append_dev(button, t15);
    			append_dev(button, br3);
    			append_dev(button, t16);
    			append_dev(button, br4);
    			append_dev(button, t17);
    			append_dev(button, t18);
    			append_dev(button, t19);
    			append_dev(button, br5);
    			append_dev(button, t20);
    			append_dev(button, span2);
    			append_dev(span2, t21);
    			append_dev(span2, t22);
    			append_dev(span2, t23);
    			append_dev(button, t24);
    			if (if_block1) if_block1.m(button, null);
    			insert_dev(target, t25, anchor);
    			mount_component(unlockdrawer, target, anchor);
    			insert_dev(target, t26, anchor);
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div1);
    			mount_component(upgradebutton0, div1, null);
    			append_dev(div1, t27);
    			mount_component(upgradebutton1, div1, null);
    			append_dev(div1, t28);
    			mount_component(upgradebutton2, div1, null);
    			append_dev(div1, t29);
    			mount_component(upgradebutton3, div1, null);
    			append_dev(div1, t30);
    			mount_component(upgradebutton4, div1, null);
    			append_dev(div3, t31);
    			append_dev(div3, div2);
    			mount_component(effectcomponent, div2, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*handleMoldyCheeseGenerationButton*/ ctx[15], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*$resource*/ 4) && t1_value !== (t1_value = formatNumber(/*$resource*/ ctx[2].moldyCheese, 2) + "")) set_data_dev(t1, t1_value);
    			if ((!current || dirty & /*$mcHalfLifeSeconds*/ 32) && t7_value !== (t7_value = formatWhole(/*$mcHalfLifeSeconds*/ ctx[5]) + "")) set_data_dev(t7, t7_value);
    			if ((!current || dirty & /*$mcHalfLifeSeconds*/ 32) && t9_value !== (t9_value = formatNumber(100 - 100 * (1 - Math.log(2) / /*$mcHalfLifeSeconds*/ ctx[5]), 2) + "")) set_data_dev(t9, t9_value);

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block0) {
    				if_block0.p(ctx, dirty);
    			} else {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(span1, null);
    				}
    			}

    			if ((!current || dirty & /*$mcManualConversionAmount*/ 8) && t18_value !== (t18_value = formatNumber(/*$mcManualConversionAmount*/ ctx[3], 2) + "")) set_data_dev(t18, t18_value);
    			if ((!current || dirty & /*$mcConversionCooldownMS*/ 16) && t22_value !== (t22_value = formatWhole(/*$mcConversionCooldownMS*/ ctx[4] / 1000) + "")) set_data_dev(t22, t22_value);

    			if (/*conversionOnCD*/ ctx[0]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block$4(ctx);
    					if_block1.c();
    					if_block1.m(button, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (!current || dirty & /*conversionOnCD*/ 1) {
    				prop_dev(button, "disabled", /*conversionOnCD*/ ctx[0]);
    			}

    			const upgradebutton0_changes = {};
    			if (dirty & /*$mcConversionExponent*/ 2048) upgradebutton0_changes.tooltipText = `Currently: cheese^${formatNumber(/*$mcConversionExponent*/ ctx[11], 4)}`;

    			if (dirty & /*$$scope*/ 131072) {
    				upgradebutton0_changes.$$scope = { dirty, ctx };
    			}

    			upgradebutton0.$set(upgradebutton0_changes);
    			const upgradebutton1_changes = {};
    			if (dirty & /*$mcHalfLifeSeconds*/ 32) upgradebutton1_changes.tooltipText = `+10s half-life <br> Currently: ${formatWhole(/*$mcHalfLifeSeconds*/ ctx[5])}s`;

    			if (dirty & /*$$scope*/ 131072) {
    				upgradebutton1_changes.$$scope = { dirty, ctx };
    			}

    			upgradebutton1.$set(upgradebutton1_changes);
    			const upgradebutton2_changes = {};
    			if (dirty & /*$unlocked*/ 64) upgradebutton2_changes.btnUnlocked = /*$unlocked*/ ctx[6].moldyCheeseByproduct;
    			if (dirty & /*$moldyCheeseChance*/ 512) upgradebutton2_changes.tooltipText = `+10% chance (additive) <br> Currently: ${formatNumber(/*$moldyCheeseChance*/ ctx[9] * 100, 1)}%`;

    			if (dirty & /*$$scope*/ 131072) {
    				upgradebutton2_changes.$$scope = { dirty, ctx };
    			}

    			upgradebutton2.$set(upgradebutton2_changes);
    			const upgradebutton3_changes = {};
    			if (dirty & /*$unlocked*/ 64) upgradebutton3_changes.btnUnlocked = /*$unlocked*/ ctx[6].cheeseyard;

    			if (dirty & /*$cheeseMonsterSpawnrate*/ 4096) upgradebutton3_changes.tooltipText = /*$cheeseMonsterSpawnrate*/ ctx[12] < 1
    			? `+${formatWhole(20)} spawns/min <br> Currently: ${formatWhole(/*$cheeseMonsterSpawnrate*/ ctx[12] * 60)} spawns/min`
    			: `+${formatNumber(20 / 60, 2)} spawns/s <br> Currently: ${formatNumber(/*$cheeseMonsterSpawnrate*/ ctx[12], 2)} spawns/s`;

    			if (dirty & /*$$scope*/ 131072) {
    				upgradebutton3_changes.$$scope = { dirty, ctx };
    			}

    			upgradebutton3.$set(upgradebutton3_changes);
    			const upgradebutton4_changes = {};
    			if (dirty & /*$unlocked*/ 64) upgradebutton4_changes.btnUnlocked = /*$unlocked*/ ctx[6].cheeseyard;
    			if (dirty & /*$cheeseMonsterCapacity*/ 8192) upgradebutton4_changes.tooltipText = `+10 capacity <br> Currently: ${formatWhole(/*$cheeseMonsterCapacity*/ ctx[13])}`;

    			if (dirty & /*$$scope*/ 131072) {
    				upgradebutton4_changes.$$scope = { dirty, ctx };
    			}

    			upgradebutton4.$set(upgradebutton4_changes);
    			const effectcomponent_changes = {};

    			if (dirty & /*$$scope, $mcHalflifeBoostFactor, $unlocked*/ 147520) {
    				effectcomponent_changes.$$scope = { dirty, ctx };
    			}

    			effectcomponent.$set(effectcomponent_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(unlockdrawer.$$.fragment, local);
    			transition_in(upgradebutton0.$$.fragment, local);
    			transition_in(upgradebutton1.$$.fragment, local);
    			transition_in(upgradebutton2.$$.fragment, local);
    			transition_in(upgradebutton3.$$.fragment, local);
    			transition_in(upgradebutton4.$$.fragment, local);
    			transition_in(effectcomponent.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(unlockdrawer.$$.fragment, local);
    			transition_out(upgradebutton0.$$.fragment, local);
    			transition_out(upgradebutton1.$$.fragment, local);
    			transition_out(upgradebutton2.$$.fragment, local);
    			transition_out(upgradebutton3.$$.fragment, local);
    			transition_out(upgradebutton4.$$.fragment, local);
    			transition_out(effectcomponent.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if_block0.d();
    			if (detaching) detach_dev(t13);
    			if (detaching) detach_dev(button);
    			if (if_block1) if_block1.d();
    			if (detaching) detach_dev(t25);
    			destroy_component(unlockdrawer, detaching);
    			if (detaching) detach_dev(t26);
    			if (detaching) detach_dev(div3);
    			destroy_component(upgradebutton0);
    			destroy_component(upgradebutton1);
    			destroy_component(upgradebutton2);
    			destroy_component(upgradebutton3);
    			destroy_component(upgradebutton4);
    			destroy_component(effectcomponent);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(34:0) <Window title=\\\"Moldy Cheese\\\" themeColor1=\\\"rgb(75, 121, 0)\\\" themeColor2=\\\"rgb(136, 255, 0)\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let window;
    	let current;

    	window = new Window({
    			props: {
    				title: "Moldy Cheese",
    				themeColor1: "rgb(75, 121, 0)",
    				themeColor2: "rgb(136, 255, 0)",
    				$$slots: { default: [create_default_slot$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(window.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(window, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const window_changes = {};

    			if (dirty & /*$$scope, $mcHalflifeBoostFactor, $unlocked, $cheeseMonsterCapacity, $cheeseMonsterSpawnrate, $moldyCheeseChance, $mcHalfLifeSeconds, $mcConversionExponent, conversionOnCD, cdTimer, $mcConversionCooldownMS, $mcManualConversionAmount, $mcByproductAmount, $cheeseCycleDuration, $LORCA_OVERRIDE, $resource*/ 163839) {
    				window_changes.$$scope = { dirty, ctx };
    			}

    			window.$set(window_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(window.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(window.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(window, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const buyMaxUpgrades$1 = false;

    function instance$8($$self, $$props, $$invalidate) {
    	let $resource;
    	let $mcManualConversionAmount;
    	let $mcConversionCooldownMS;
    	let $mcHalfLifeSeconds;
    	let $unlocked;
    	let $LORCA_OVERRIDE;
    	let $mcByproductAmount;
    	let $moldyCheeseChance;
    	let $cheeseCycleDuration;
    	let $mcConversionExponent;
    	let $cheeseMonsterSpawnrate;
    	let $cheeseMonsterCapacity;
    	let $mcHalflifeBoostFactor;
    	validate_store(resource, 'resource');
    	component_subscribe($$self, resource, $$value => $$invalidate(2, $resource = $$value));
    	validate_store(mcManualConversionAmount, 'mcManualConversionAmount');
    	component_subscribe($$self, mcManualConversionAmount, $$value => $$invalidate(3, $mcManualConversionAmount = $$value));
    	validate_store(mcConversionCooldownMS, 'mcConversionCooldownMS');
    	component_subscribe($$self, mcConversionCooldownMS, $$value => $$invalidate(4, $mcConversionCooldownMS = $$value));
    	validate_store(mcHalfLifeSeconds, 'mcHalfLifeSeconds');
    	component_subscribe($$self, mcHalfLifeSeconds, $$value => $$invalidate(5, $mcHalfLifeSeconds = $$value));
    	validate_store(unlocked, 'unlocked');
    	component_subscribe($$self, unlocked, $$value => $$invalidate(6, $unlocked = $$value));
    	validate_store(LORCA_OVERRIDE, 'LORCA_OVERRIDE');
    	component_subscribe($$self, LORCA_OVERRIDE, $$value => $$invalidate(7, $LORCA_OVERRIDE = $$value));
    	validate_store(mcByproductAmount, 'mcByproductAmount');
    	component_subscribe($$self, mcByproductAmount, $$value => $$invalidate(8, $mcByproductAmount = $$value));
    	validate_store(moldyCheeseChance, 'moldyCheeseChance');
    	component_subscribe($$self, moldyCheeseChance, $$value => $$invalidate(9, $moldyCheeseChance = $$value));
    	validate_store(cheeseCycleDuration, 'cheeseCycleDuration');
    	component_subscribe($$self, cheeseCycleDuration, $$value => $$invalidate(10, $cheeseCycleDuration = $$value));
    	validate_store(mcConversionExponent, 'mcConversionExponent');
    	component_subscribe($$self, mcConversionExponent, $$value => $$invalidate(11, $mcConversionExponent = $$value));
    	validate_store(cheeseMonsterSpawnrate, 'cheeseMonsterSpawnrate');
    	component_subscribe($$self, cheeseMonsterSpawnrate, $$value => $$invalidate(12, $cheeseMonsterSpawnrate = $$value));
    	validate_store(cheeseMonsterCapacity, 'cheeseMonsterCapacity');
    	component_subscribe($$self, cheeseMonsterCapacity, $$value => $$invalidate(13, $cheeseMonsterCapacity = $$value));
    	validate_store(mcHalflifeBoostFactor, 'mcHalflifeBoostFactor');
    	component_subscribe($$self, mcHalflifeBoostFactor, $$value => $$invalidate(14, $mcHalflifeBoostFactor = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MoldyCheeseComponent', slots, []);
    	let conversionOnCD = false;
    	let cdTimer;
    	let intervalId;

    	function handleMoldyCheeseGenerationButton() {
    		if (conversionOnCD) return;
    		$$invalidate(0, conversionOnCD = true);
    		$$invalidate(1, cdTimer = $mcConversionCooldownMS);
    		set_store_value(resource, $resource.moldyCheese += $mcManualConversionAmount, $resource);
    		set_store_value(resource, $resource.cheese = 0, $resource);
    		let lastTime = Date.now();
    		clearInterval(intervalId);

    		intervalId = setInterval(
    			() => {
    				const currentTime = Date.now();
    				const dt = Math.max(Math.min(currentTime - lastTime, 1000), 0);
    				lastTime = currentTime;
    				$$invalidate(1, cdTimer -= dt);

    				if (cdTimer <= 0) {
    					$$invalidate(0, conversionOnCD = false);
    					clearInterval(intervalId);
    				}
    			},
    			100
    		);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MoldyCheeseComponent> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Window,
    		formatNumber,
    		formatWhole,
    		UpgradeButton,
    		LORCA_OVERRIDE,
    		resource,
    		unlocked,
    		cheeseCycleDuration,
    		mcHalfLifeSeconds,
    		moldyCheeseChance,
    		cheeseMonsterCapacity,
    		cheeseMonsterSpawnrate,
    		unlocks,
    		mcByproductAmount,
    		mcManualConversionAmount,
    		mcConversionExponent,
    		mcHalflifeBoostFactor,
    		mcConversionCooldownMS,
    		UnlockDrawer,
    		EffectComponent,
    		Effect,
    		buyMaxUpgrades: buyMaxUpgrades$1,
    		conversionOnCD,
    		cdTimer,
    		intervalId,
    		handleMoldyCheeseGenerationButton,
    		$resource,
    		$mcManualConversionAmount,
    		$mcConversionCooldownMS,
    		$mcHalfLifeSeconds,
    		$unlocked,
    		$LORCA_OVERRIDE,
    		$mcByproductAmount,
    		$moldyCheeseChance,
    		$cheeseCycleDuration,
    		$mcConversionExponent,
    		$cheeseMonsterSpawnrate,
    		$cheeseMonsterCapacity,
    		$mcHalflifeBoostFactor
    	});

    	$$self.$inject_state = $$props => {
    		if ('conversionOnCD' in $$props) $$invalidate(0, conversionOnCD = $$props.conversionOnCD);
    		if ('cdTimer' in $$props) $$invalidate(1, cdTimer = $$props.cdTimer);
    		if ('intervalId' in $$props) intervalId = $$props.intervalId;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		conversionOnCD,
    		cdTimer,
    		$resource,
    		$mcManualConversionAmount,
    		$mcConversionCooldownMS,
    		$mcHalfLifeSeconds,
    		$unlocked,
    		$LORCA_OVERRIDE,
    		$mcByproductAmount,
    		$moldyCheeseChance,
    		$cheeseCycleDuration,
    		$mcConversionExponent,
    		$cheeseMonsterSpawnrate,
    		$cheeseMonsterCapacity,
    		$mcHalflifeBoostFactor,
    		handleMoldyCheeseGenerationButton
    	];
    }

    class MoldyCheeseComponent extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MoldyCheeseComponent",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* src/components/tooltips/MonsterBrainWaveController.svelte generated by Svelte v3.44.1 */

    const file$7 = "src/components/tooltips/MonsterBrainWaveController.svelte";

    function create_fragment$7(ctx) {
    	let div1;
    	let span0;
    	let t1;
    	let br;
    	let t2;
    	let span4;
    	let span1;
    	let t3_value = /*brainModeDescription*/ ctx[2][/*data*/ ctx[0]] + "";
    	let t3;
    	let t4;
    	let span2;
    	let t5;

    	let t6_value = (cheeseMonsterDeathRateStats[/*data*/ ctx[0]] > 0
    	? `${formatNumber(cheeseMonsterDeathRateStats[/*data*/ ctx[0]], 2)}/s/monster`
    	: 'None') + "";

    	let t6;
    	let t7;
    	let span3;
    	let t8;
    	let t9_value = cheeseMonsterBrainModeResourceFactors[/*data*/ ctx[0]] + "";
    	let t9;
    	let t10;
    	let t11;
    	let div0;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			span0 = element("span");
    			span0.textContent = "Monster Info";
    			t1 = space();
    			br = element("br");
    			t2 = space();
    			span4 = element("span");
    			span1 = element("span");
    			t3 = text(t3_value);
    			t4 = space();
    			span2 = element("span");
    			t5 = text("Death toll: ");
    			t6 = text(t6_value);
    			t7 = space();
    			span3 = element("span");
    			t8 = text("Relative resource generation: ");
    			t9 = text(t9_value);
    			t10 = text("x");
    			t11 = space();
    			div0 = element("div");
    			div0.textContent = "The less preoccupied the monsters are with killing each other, the more they can ponder and produce stuff.";
    			set_style(span0, "text-decoration", "underline");
    			set_style(span0, "font-weight", "bold");
    			set_style(span0, "color", "rgb(255, 0, 98)");
    			set_style(span0, "margin-bottom", "0.25rem");
    			add_location(span0, file$7, 14, 2, 637);
    			add_location(br, file$7, 17, 2, 775);
    			add_location(span1, file$7, 19, 4, 851);
    			attr_dev(span2, "class", "effect svelte-oq5dyc");
    			add_location(span2, file$7, 20, 4, 897);
    			attr_dev(span3, "class", "effect svelte-oq5dyc");
    			add_location(span3, file$7, 25, 4, 1086);
    			set_style(div0, "opacity", "var(--medium-emphasis)");
    			set_style(div0, "font-style", "oblique");
    			set_style(div0, "text-align", "right");
    			set_style(div0, "padding-left", "20px");
    			set_style(div0, "margin-top", "0.25rem ");
    			add_location(div0, file$7, 26, 4, 1195);
    			set_style(span4, "display", "flex");
    			set_style(span4, "flex-direction", "column");
    			set_style(span4, "gap", "0.25rem");
    			add_location(span4, file$7, 18, 2, 784);
    			attr_dev(div1, "class", "tooltip-arrow-up svelte-oq5dyc");
    			attr_dev(div1, "id", "brainWaveInfo");
    			attr_dev(div1, "style", /*style*/ ctx[1]);
    			add_location(div1, file$7, 13, 0, 577);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, span0);
    			append_dev(div1, t1);
    			append_dev(div1, br);
    			append_dev(div1, t2);
    			append_dev(div1, span4);
    			append_dev(span4, span1);
    			append_dev(span1, t3);
    			append_dev(span4, t4);
    			append_dev(span4, span2);
    			append_dev(span2, t5);
    			append_dev(span2, t6);
    			append_dev(span4, t7);
    			append_dev(span4, span3);
    			append_dev(span3, t8);
    			append_dev(span3, t9);
    			append_dev(span3, t10);
    			append_dev(span4, t11);
    			append_dev(span4, div0);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*data*/ 1 && t3_value !== (t3_value = /*brainModeDescription*/ ctx[2][/*data*/ ctx[0]] + "")) set_data_dev(t3, t3_value);

    			if (dirty & /*data*/ 1 && t6_value !== (t6_value = (cheeseMonsterDeathRateStats[/*data*/ ctx[0]] > 0
    			? `${formatNumber(cheeseMonsterDeathRateStats[/*data*/ ctx[0]], 2)}/s/monster`
    			: 'None') + "")) set_data_dev(t6, t6_value);

    			if (dirty & /*data*/ 1 && t9_value !== (t9_value = cheeseMonsterBrainModeResourceFactors[/*data*/ ctx[0]] + "")) set_data_dev(t9, t9_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MonsterBrainWaveController', slots, []);
    	let { data } = $$props;
    	let { top = 0 } = $$props;
    	let { left = 0 } = $$props;
    	const style = `top: ${top}px; left: ${left - 75}px;`;

    	const brainModeDescription = {
    		peaceful: 'Inner peace lets your monsters supress their destructive urges.',
    		neutral: 'Occasionally some monsters may start a fight to the death if they feel like it.',
    		destructive: 'Monsters attack each other on sight, ripping out their brains.'
    	};

    	const writable_props = ['data', 'top', 'left'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MonsterBrainWaveController> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('data' in $$props) $$invalidate(0, data = $$props.data);
    		if ('top' in $$props) $$invalidate(3, top = $$props.top);
    		if ('left' in $$props) $$invalidate(4, left = $$props.left);
    	};

    	$$self.$capture_state = () => ({
    		formatNumber,
    		cheeseMonsterDeathRateStats,
    		cheeseMonsterBrainModeResourceFactors,
    		data,
    		top,
    		left,
    		style,
    		brainModeDescription
    	});

    	$$self.$inject_state = $$props => {
    		if ('data' in $$props) $$invalidate(0, data = $$props.data);
    		if ('top' in $$props) $$invalidate(3, top = $$props.top);
    		if ('left' in $$props) $$invalidate(4, left = $$props.left);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [data, style, brainModeDescription, top, left];
    }

    class MonsterBrainWaveController extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { data: 0, top: 3, left: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MonsterBrainWaveController",
    			options,
    			id: create_fragment$7.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*data*/ ctx[0] === undefined && !('data' in props)) {
    			console.warn("<MonsterBrainWaveController> was created without expected prop 'data'");
    		}
    	}

    	get data() {
    		throw new Error("<MonsterBrainWaveController>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<MonsterBrainWaveController>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get top() {
    		throw new Error("<MonsterBrainWaveController>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set top(value) {
    		throw new Error("<MonsterBrainWaveController>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get left() {
    		throw new Error("<MonsterBrainWaveController>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set left(value) {
    		throw new Error("<MonsterBrainWaveController>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/game-windows/CheeseyardComponent.svelte generated by Svelte v3.44.1 */
    const file$6 = "src/components/game-windows/CheeseyardComponent.svelte";

    // (37:6) {:else}
    function create_else_block_2(ctx) {
    	let span;
    	let t0;
    	let br;
    	let t1;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t0 = text("...???\n          ");
    			br = element("br");
    			t1 = text("\n          ...???");
    			add_location(br, file$6, 39, 10, 2216);
    			add_location(span, file$6, 37, 8, 2182);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t0);
    			append_dev(span, br);
    			append_dev(span, t1);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_2.name,
    		type: "else",
    		source: "(37:6) {:else}",
    		ctx
    	});

    	return block;
    }

    // (31:6) {#if $totalCheeseMonsterDeaths > 0}
    function create_if_block_3$1(ctx) {
    	let span;
    	let t0;

    	let t1_value = (/*$cheeseMonsterDeathrate*/ ctx[6] > 0
    	? `${formatNumber(/*$cheeseMonsterDeathsPerSec*/ ctx[7], 2)}/s`
    	: 'None') + "";

    	let t1;
    	let t2;
    	let br;
    	let t3;
    	let t4_value = formatWhole(/*$totalCheeseMonsterDeaths*/ ctx[5]) + "";
    	let t4;
    	let span_transition;
    	let current;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t0 = text("Approx. deaths: ");
    			t1 = text(t1_value);
    			t2 = space();
    			br = element("br");
    			t3 = text("\n          Total deaths: ");
    			t4 = text(t4_value);
    			add_location(br, file$6, 33, 10, 2072);
    			add_location(span, file$6, 31, 8, 1900);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t0);
    			append_dev(span, t1);
    			append_dev(span, t2);
    			append_dev(span, br);
    			append_dev(span, t3);
    			append_dev(span, t4);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*$cheeseMonsterDeathrate, $cheeseMonsterDeathsPerSec*/ 192) && t1_value !== (t1_value = (/*$cheeseMonsterDeathrate*/ ctx[6] > 0
    			? `${formatNumber(/*$cheeseMonsterDeathsPerSec*/ ctx[7], 2)}/s`
    			: 'None') + "")) set_data_dev(t1, t1_value);

    			if ((!current || dirty & /*$totalCheeseMonsterDeaths*/ 32) && t4_value !== (t4_value = formatWhole(/*$totalCheeseMonsterDeaths*/ ctx[5]) + "")) set_data_dev(t4, t4_value);
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!span_transition) span_transition = create_bidirectional_transition(span, fade, { duration: 1000 }, true);
    				span_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!span_transition) span_transition = create_bidirectional_transition(span, fade, { duration: 1000 }, false);
    			span_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (detaching && span_transition) span_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(31:6) {#if $totalCheeseMonsterDeaths > 0}",
    		ctx
    	});

    	return block;
    }

    // (58:4) {:else}
    function create_else_block_1(ctx) {
    	let div;
    	let fieldset;
    	let legend;
    	let t1;
    	let label0;
    	let input0;
    	let t2;
    	let t3;
    	let label1;
    	let input1;
    	let t4;
    	let t5;
    	let label2;
    	let input2;
    	let t6;
    	let div_transition;
    	let current;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			fieldset = element("fieldset");
    			legend = element("legend");
    			legend.textContent = "monster brain wave controller";
    			t1 = space();
    			label0 = element("label");
    			input0 = element("input");
    			t2 = text("\n            peaceful");
    			t3 = space();
    			label1 = element("label");
    			input1 = element("input");
    			t4 = text("\n            neutral");
    			t5 = space();
    			label2 = element("label");
    			input2 = element("input");
    			t6 = text("\n            destructive");
    			add_location(legend, file$6, 60, 10, 2793);
    			attr_dev(input0, "type", "radio");
    			attr_dev(input0, "name", "brainMode");
    			input0.__value = 'peaceful';
    			input0.value = input0.__value;
    			/*$$binding_groups*/ ctx[22][0].push(input0);
    			add_location(input0, file$6, 65, 12, 3024);
    			attr_dev(label0, "class", "bg-on-hover");
    			add_location(label0, file$6, 61, 10, 2850);
    			attr_dev(input1, "type", "radio");
    			attr_dev(input1, "name", "brainMode");
    			input1.__value = 'neutral';
    			input1.value = input1.__value;
    			/*$$binding_groups*/ ctx[22][0].push(input1);
    			add_location(input1, file$6, 72, 12, 3330);
    			attr_dev(label1, "class", "bg-on-hover");
    			add_location(label1, file$6, 68, 10, 3157);
    			attr_dev(input2, "type", "radio");
    			attr_dev(input2, "name", "brainMode");
    			input2.__value = 'destructive';
    			input2.value = input2.__value;
    			/*$$binding_groups*/ ctx[22][0].push(input2);
    			add_location(input2, file$6, 79, 12, 3638);
    			attr_dev(label2, "class", "bg-on-hover");
    			add_location(label2, file$6, 75, 10, 3461);
    			add_location(fieldset, file$6, 59, 8, 2772);
    			add_location(div, file$6, 58, 6, 2721);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, fieldset);
    			append_dev(fieldset, legend);
    			append_dev(fieldset, t1);
    			append_dev(fieldset, label0);
    			append_dev(label0, input0);
    			input0.checked = input0.__value === /*$brainMode*/ ctx[8];
    			append_dev(label0, t2);
    			append_dev(fieldset, t3);
    			append_dev(fieldset, label1);
    			append_dev(label1, input1);
    			input1.checked = input1.__value === /*$brainMode*/ ctx[8];
    			append_dev(label1, t4);
    			append_dev(fieldset, t5);
    			append_dev(fieldset, label2);
    			append_dev(label2, input2);
    			input2.checked = input2.__value === /*$brainMode*/ ctx[8];
    			append_dev(label2, t6);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "change", /*input0_change_handler*/ ctx[21]),
    					action_destroyer(tooltip.call(null, label0, {
    						data: 'peaceful',
    						Component: MonsterBrainWaveController,
    						anchor: 'parentElement'
    					})),
    					listen_dev(input1, "change", /*input1_change_handler*/ ctx[23]),
    					action_destroyer(tooltip.call(null, label1, {
    						data: 'neutral',
    						Component: MonsterBrainWaveController,
    						anchor: 'parentElement'
    					})),
    					listen_dev(input2, "change", /*input2_change_handler*/ ctx[24]),
    					action_destroyer(tooltip.call(null, label2, {
    						data: 'destructive',
    						Component: MonsterBrainWaveController,
    						anchor: 'parentElement'
    					}))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$brainMode*/ 256) {
    				input0.checked = input0.__value === /*$brainMode*/ ctx[8];
    			}

    			if (dirty & /*$brainMode*/ 256) {
    				input1.checked = input1.__value === /*$brainMode*/ ctx[8];
    			}

    			if (dirty & /*$brainMode*/ 256) {
    				input2.checked = input2.__value === /*$brainMode*/ ctx[8];
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!div_transition) div_transition = create_bidirectional_transition(div, fade, { duration: 1000 }, true);
    				div_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!div_transition) div_transition = create_bidirectional_transition(div, fade, { duration: 1000 }, false);
    			div_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			/*$$binding_groups*/ ctx[22][0].splice(/*$$binding_groups*/ ctx[22][0].indexOf(input0), 1);
    			/*$$binding_groups*/ ctx[22][0].splice(/*$$binding_groups*/ ctx[22][0].indexOf(input1), 1);
    			/*$$binding_groups*/ ctx[22][0].splice(/*$$binding_groups*/ ctx[22][0].indexOf(input2), 1);
    			if (detaching && div_transition) div_transition.end();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(58:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (48:4) {#if !controllerUnlocked}
    function create_if_block_2$2(ctx) {
    	let button;
    	let t0;
    	let br;
    	let t1;
    	let button_disabled_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			t0 = text("Activate the monster brain wave controller ");
    			br = element("br");
    			t1 = text("\n        Requires 10 cheese monsters");
    			add_location(br, file$6, 54, 51, 2644);
    			set_style(button, "height", "max-content");
    			set_style(button, "width", "202.5px");
    			button.disabled = button_disabled_value = /*$resource*/ ctx[2].cheeseMonster < 10;
    			add_location(button, file$6, 48, 6, 2385);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t0);
    			append_dev(button, br);
    			append_dev(button, t1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button, "click", /*unlockBrainWaveController*/ ctx[20], false, false, false),
    					action_destroyer(tooltip.call(null, button, { data: 'Are you sure?' }))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$resource*/ 4 && button_disabled_value !== (button_disabled_value = /*$resource*/ ctx[2].cheeseMonster < 10)) {
    				prop_dev(button, "disabled", button_disabled_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(48:4) {#if !controllerUnlocked}",
    		ctx
    	});

    	return block;
    }

    // (96:8) {:else}
    function create_else_block(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("⮞ ...???");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(96:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (94:8) {#if $upgrades.cheeseMonsterMoldiness.bought > 0}
    function create_if_block_1$3(ctx) {
    	let t0;
    	let t1_value = formatNumber(/*$monsterMoldyCheeseMult*/ ctx[11], 2) + "";
    	let t1;
    	let t2;

    	const block = {
    		c: function create() {
    			t0 = text("⮞ MC gain is boosted by ");
    			t1 = text(t1_value);
    			t2 = text("x");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, t2, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$monsterMoldyCheeseMult*/ 2048 && t1_value !== (t1_value = formatNumber(/*$monsterMoldyCheeseMult*/ ctx[11], 2) + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(t2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(94:8) {#if $upgrades.cheeseMonsterMoldiness.bought > 0}",
    		ctx
    	});

    	return block;
    }

    // (103:2) {#if controllerUnlocked}
    function create_if_block$3(ctx) {
    	let div0;
    	let span1;
    	let t0;
    	let t1_value = formatNumber(/*$resource*/ ctx[2].cheeseBrains, 2) + "";
    	let t1;
    	let t2;
    	let span0;
    	let t4;
    	let br;
    	let t5;
    	let span2;
    	let t6;
    	let t7_value = formatNumber(/*$approxCheeseBrainsPerSec*/ ctx[12], 2) + "";
    	let t7;
    	let t8;
    	let div0_transition;
    	let t9;
    	let unlockdrawer;
    	let t10;
    	let div3;
    	let div1;
    	let upgradebutton0;
    	let t11;
    	let upgradebutton1;
    	let t12;
    	let upgradebutton2;
    	let t13;
    	let upgradebutton3;
    	let t14;
    	let div2;
    	let effectcomponent;
    	let div3_transition;
    	let current;

    	unlockdrawer = new UnlockDrawer({
    			props: {
    				unlocks: unlocks.cheeseBrains,
    				folderName: "Free Warlock Skills"
    			},
    			$$inline: true
    		});

    	upgradebutton0 = new UpgradeButton({
    			props: {
    				upgradeName: "cheeseMonsterDropRate",
    				buyMaxUpgrades,
    				tooltipText: `+5% drop rate (additive) <br> Currently: ${formatWhole(/*$cheeseMonsterDropRate*/ ctx[13] * 100)}%`,
    				$$slots: { default: [create_default_slot_8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	upgradebutton1 = new UpgradeButton({
    			props: {
    				upgradeName: "cheeseMonsterLoot",
    				buyMaxUpgrades,
    				tooltipText: `+1 brain/death <br> Currently: ${formatWhole(/*$cheeseMonsterLootAmount*/ ctx[14])} cheese brains/death`,
    				$$slots: { default: [create_default_slot_7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	upgradebutton2 = new UpgradeButton({
    			props: {
    				upgradeName: "cheeseMonsterSentience",
    				buyMaxUpgrades,
    				tooltipText: `+1x thoughts/s/monster <br> Currently: +${formatNumber(/*$monsterThoughtFactor*/ ctx[15], 2)}x thoughts/s/monster`,
    				$$slots: { default: [create_default_slot_6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	upgradebutton3 = new UpgradeButton({
    			props: {
    				btnUnlocked: /*$unlocked*/ ctx[0].cheeseyardMoldUpgrade,
    				upgradeName: "cheeseMonsterMoldiness",
    				buyMaxUpgrades,
    				tooltipText: `+0.01x MC gain/monster <br> Currently: +${formatNumber(/*$monsterMoldyCheeseFactor*/ ctx[16], 2)}x MC gain/monster <br> (MC = moldy cheese)`,
    				$$slots: { default: [create_default_slot_5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	effectcomponent = new EffectComponent({
    			props: {
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			span1 = element("span");
    			t0 = text("You have ");
    			t1 = text(t1_value);
    			t2 = space();
    			span0 = element("span");
    			span0.textContent = "cheese brains";
    			t4 = space();
    			br = element("br");
    			t5 = space();
    			span2 = element("span");
    			t6 = text("~ ");
    			t7 = text(t7_value);
    			t8 = text("/s");
    			t9 = space();
    			create_component(unlockdrawer.$$.fragment);
    			t10 = space();
    			div3 = element("div");
    			div1 = element("div");
    			create_component(upgradebutton0.$$.fragment);
    			t11 = space();
    			create_component(upgradebutton1.$$.fragment);
    			t12 = space();
    			create_component(upgradebutton2.$$.fragment);
    			t13 = space();
    			create_component(upgradebutton3.$$.fragment);
    			t14 = space();
    			div2 = element("div");
    			create_component(effectcomponent.$$.fragment);
    			set_style(span0, "color", "rgb(250, 142, 0)");
    			set_style(span0, "font-weight", "bold");
    			add_location(span0, file$6, 106, 8, 4426);
    			add_location(br, file$6, 107, 8, 4511);
    			attr_dev(span1, "class", "resourceDisplay");
    			add_location(span1, file$6, 104, 6, 4328);
    			add_location(span2, file$6, 109, 6, 4538);
    			add_location(div0, file$6, 103, 4, 4279);
    			attr_dev(div1, "class", "gridColumn");
    			add_location(div1, file$6, 115, 6, 4776);
    			attr_dev(div2, "class", "gridColumn");
    			set_style(div2, "height", "264px");
    			set_style(div2, "width", "100%");
    			add_location(div2, file$6, 156, 6, 6192);
    			attr_dev(div3, "class", "flexRowContainer");
    			add_location(div3, file$6, 114, 4, 4702);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, span1);
    			append_dev(span1, t0);
    			append_dev(span1, t1);
    			append_dev(span1, t2);
    			append_dev(span1, span0);
    			append_dev(span1, t4);
    			append_dev(span1, br);
    			append_dev(div0, t5);
    			append_dev(div0, span2);
    			append_dev(span2, t6);
    			append_dev(span2, t7);
    			append_dev(span2, t8);
    			insert_dev(target, t9, anchor);
    			mount_component(unlockdrawer, target, anchor);
    			insert_dev(target, t10, anchor);
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div1);
    			mount_component(upgradebutton0, div1, null);
    			append_dev(div1, t11);
    			mount_component(upgradebutton1, div1, null);
    			append_dev(div1, t12);
    			mount_component(upgradebutton2, div1, null);
    			append_dev(div1, t13);
    			mount_component(upgradebutton3, div1, null);
    			append_dev(div3, t14);
    			append_dev(div3, div2);
    			mount_component(effectcomponent, div2, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*$resource*/ 4) && t1_value !== (t1_value = formatNumber(/*$resource*/ ctx[2].cheeseBrains, 2) + "")) set_data_dev(t1, t1_value);
    			if ((!current || dirty & /*$approxCheeseBrainsPerSec*/ 4096) && t7_value !== (t7_value = formatNumber(/*$approxCheeseBrainsPerSec*/ ctx[12], 2) + "")) set_data_dev(t7, t7_value);
    			const upgradebutton0_changes = {};
    			if (dirty & /*$cheeseMonsterDropRate*/ 8192) upgradebutton0_changes.tooltipText = `+5% drop rate (additive) <br> Currently: ${formatWhole(/*$cheeseMonsterDropRate*/ ctx[13] * 100)}%`;

    			if (dirty & /*$$scope*/ 268435456) {
    				upgradebutton0_changes.$$scope = { dirty, ctx };
    			}

    			upgradebutton0.$set(upgradebutton0_changes);
    			const upgradebutton1_changes = {};
    			if (dirty & /*$cheeseMonsterLootAmount*/ 16384) upgradebutton1_changes.tooltipText = `+1 brain/death <br> Currently: ${formatWhole(/*$cheeseMonsterLootAmount*/ ctx[14])} cheese brains/death`;

    			if (dirty & /*$$scope*/ 268435456) {
    				upgradebutton1_changes.$$scope = { dirty, ctx };
    			}

    			upgradebutton1.$set(upgradebutton1_changes);
    			const upgradebutton2_changes = {};
    			if (dirty & /*$monsterThoughtFactor*/ 32768) upgradebutton2_changes.tooltipText = `+1x thoughts/s/monster <br> Currently: +${formatNumber(/*$monsterThoughtFactor*/ ctx[15], 2)}x thoughts/s/monster`;

    			if (dirty & /*$$scope*/ 268435456) {
    				upgradebutton2_changes.$$scope = { dirty, ctx };
    			}

    			upgradebutton2.$set(upgradebutton2_changes);
    			const upgradebutton3_changes = {};
    			if (dirty & /*$unlocked*/ 1) upgradebutton3_changes.btnUnlocked = /*$unlocked*/ ctx[0].cheeseyardMoldUpgrade;
    			if (dirty & /*$monsterMoldyCheeseFactor*/ 65536) upgradebutton3_changes.tooltipText = `+0.01x MC gain/monster <br> Currently: +${formatNumber(/*$monsterMoldyCheeseFactor*/ ctx[16], 2)}x MC gain/monster <br> (MC = moldy cheese)`;

    			if (dirty & /*$$scope*/ 268435456) {
    				upgradebutton3_changes.$$scope = { dirty, ctx };
    			}

    			upgradebutton3.$set(upgradebutton3_changes);
    			const effectcomponent_changes = {};

    			if (dirty & /*$$scope, $totalMonsterDeathsLootBoost, $unlocked, $cheeseMonsterCollectiveSentienceMultiplier, $cheeseMonsterMassacreMultiplier*/ 269352961) {
    				effectcomponent_changes.$$scope = { dirty, ctx };
    			}

    			effectcomponent.$set(effectcomponent_changes);
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!div0_transition) div0_transition = create_bidirectional_transition(div0, fade, { duration: 1000 }, true);
    				div0_transition.run(1);
    			});

    			transition_in(unlockdrawer.$$.fragment, local);
    			transition_in(upgradebutton0.$$.fragment, local);
    			transition_in(upgradebutton1.$$.fragment, local);
    			transition_in(upgradebutton2.$$.fragment, local);
    			transition_in(upgradebutton3.$$.fragment, local);
    			transition_in(effectcomponent.$$.fragment, local);

    			add_render_callback(() => {
    				if (!div3_transition) div3_transition = create_bidirectional_transition(div3, fade, { duration: 1000 }, true);
    				div3_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!div0_transition) div0_transition = create_bidirectional_transition(div0, fade, { duration: 1000 }, false);
    			div0_transition.run(0);
    			transition_out(unlockdrawer.$$.fragment, local);
    			transition_out(upgradebutton0.$$.fragment, local);
    			transition_out(upgradebutton1.$$.fragment, local);
    			transition_out(upgradebutton2.$$.fragment, local);
    			transition_out(upgradebutton3.$$.fragment, local);
    			transition_out(effectcomponent.$$.fragment, local);
    			if (!div3_transition) div3_transition = create_bidirectional_transition(div3, fade, { duration: 1000 }, false);
    			div3_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching && div0_transition) div0_transition.end();
    			if (detaching) detach_dev(t9);
    			destroy_component(unlockdrawer, detaching);
    			if (detaching) detach_dev(t10);
    			if (detaching) detach_dev(div3);
    			destroy_component(upgradebutton0);
    			destroy_component(upgradebutton1);
    			destroy_component(upgradebutton2);
    			destroy_component(upgradebutton3);
    			destroy_component(effectcomponent);
    			if (detaching && div3_transition) div3_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(103:2) {#if controllerUnlocked}",
    		ctx
    	});

    	return block;
    }

    // (117:8) <UpgradeButton           upgradeName="cheeseMonsterDropRate"           {buyMaxUpgrades}           tooltipText={`+5% drop rate (additive) <br> Currently: ${formatWhole($cheeseMonsterDropRate * 100)}%`}         >
    function create_default_slot_8(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Increase the drop rate of cheese monsters");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8.name,
    		type: "slot",
    		source: "(117:8) <UpgradeButton           upgradeName=\\\"cheeseMonsterDropRate\\\"           {buyMaxUpgrades}           tooltipText={`+5% drop rate (additive) <br> Currently: ${formatWhole($cheeseMonsterDropRate * 100)}%`}         >",
    		ctx
    	});

    	return block;
    }

    // (125:8) <UpgradeButton           upgradeName="cheeseMonsterLoot"           {buyMaxUpgrades}           tooltipText={`+1 brain/death <br> Currently: ${formatWhole($cheeseMonsterLootAmount)} cheese brains/death`}         >
    function create_default_slot_7(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Increase the loot obtained from cheese monster corpses");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7.name,
    		type: "slot",
    		source: "(125:8) <UpgradeButton           upgradeName=\\\"cheeseMonsterLoot\\\"           {buyMaxUpgrades}           tooltipText={`+1 brain/death <br> Currently: ${formatWhole($cheeseMonsterLootAmount)} cheese brains/death`}         >",
    		ctx
    	});

    	return block;
    }

    // (133:8) <UpgradeButton           upgradeName="cheeseMonsterSentience"           {buyMaxUpgrades}           tooltipText={`+1x thoughts/s/monster <br> Currently: +${formatNumber(             $monsterThoughtFactor,             2           )}x thoughts/s/monster`}         >
    function create_default_slot_6(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Nurture the sentience of monsters");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6.name,
    		type: "slot",
    		source: "(133:8) <UpgradeButton           upgradeName=\\\"cheeseMonsterSentience\\\"           {buyMaxUpgrades}           tooltipText={`+1x thoughts/s/monster <br> Currently: +${formatNumber(             $monsterThoughtFactor,             2           )}x thoughts/s/monster`}         >",
    		ctx
    	});

    	return block;
    }

    // (144:8) <UpgradeButton           btnUnlocked={$unlocked.cheeseyardMoldUpgrade}           upgradeName="cheeseMonsterMoldiness"           {buyMaxUpgrades}           tooltipText={`+0.01x MC gain/monster <br> Currently: +${formatNumber(             $monsterMoldyCheeseFactor,             2           )}x MC gain/monster <br> (MC = moldy cheese)`}         >
    function create_default_slot_5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Improve the moldiness of monsters");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5.name,
    		type: "slot",
    		source: "(144:8) <UpgradeButton           btnUnlocked={$unlocked.cheeseyardMoldUpgrade}           upgradeName=\\\"cheeseMonsterMoldiness\\\"           {buyMaxUpgrades}           tooltipText={`+0.01x MC gain/monster <br> Currently: +${formatNumber(             $monsterMoldyCheeseFactor,             2           )}x MC gain/monster <br> (MC = moldy cheese)`}         >",
    		ctx
    	});

    	return block;
    }

    // (159:10) <Effect             factor={$cheeseMonsterMassacreMultiplier}             unlocked={$unlocked.cheeseMonsterMassacre}             tooltipText={`Higher deaths/s are disproportionally rewarded. <br/> Scales ^1.3 with deaths/s.`}           >
    function create_default_slot_4(ctx) {
    	let t_value = unlocks.cheeseBrains.find(/*func*/ ctx[25])?.description + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(159:10) <Effect             factor={$cheeseMonsterMassacreMultiplier}             unlocked={$unlocked.cheeseMonsterMassacre}             tooltipText={`Higher deaths/s are disproportionally rewarded. <br/> Scales ^1.3 with deaths/s.`}           >",
    		ctx
    	});

    	return block;
    }

    // (166:10) <Effect             factor={$cheeseMonsterCollectiveSentienceMultiplier}             unlocked={$unlocked.cheeseMonsterCollectiveSentience}             tooltipText={`In bigger populations, a sort of global thinking <br/> emerges, giving an additional multiplier. <br/> Scales ^3 with current population.`}           >
    function create_default_slot_3(ctx) {
    	let t_value = unlocks.cheeseBrains.find(/*func_1*/ ctx[26])?.description + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(166:10) <Effect             factor={$cheeseMonsterCollectiveSentienceMultiplier}             unlocked={$unlocked.cheeseMonsterCollectiveSentience}             tooltipText={`In bigger populations, a sort of global thinking <br/> emerges, giving an additional multiplier. <br/> Scales ^3 with current population.`}           >",
    		ctx
    	});

    	return block;
    }

    // (173:10) <Effect             factor={$totalMonsterDeathsLootBoost}             unlocked={$unlocked.cheeseMonsterTotalDeathsBoost}             tooltipText={`Scales ^2 with total deaths`}           >
    function create_default_slot_2(ctx) {
    	let t_value = unlocks.cheeseBrains.find(/*func_2*/ ctx[27])?.description + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(173:10) <Effect             factor={$totalMonsterDeathsLootBoost}             unlocked={$unlocked.cheeseMonsterTotalDeathsBoost}             tooltipText={`Scales ^2 with total deaths`}           >",
    		ctx
    	});

    	return block;
    }

    // (158:8) <EffectComponent>
    function create_default_slot_1(ctx) {
    	let effect0;
    	let t0;
    	let effect1;
    	let t1;
    	let effect2;
    	let current;

    	effect0 = new Effect({
    			props: {
    				factor: /*$cheeseMonsterMassacreMultiplier*/ ctx[17],
    				unlocked: /*$unlocked*/ ctx[0].cheeseMonsterMassacre,
    				tooltipText: `Higher deaths/s are disproportionally rewarded. <br/> Scales ^1.3 with deaths/s.`,
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	effect1 = new Effect({
    			props: {
    				factor: /*$cheeseMonsterCollectiveSentienceMultiplier*/ ctx[18],
    				unlocked: /*$unlocked*/ ctx[0].cheeseMonsterCollectiveSentience,
    				tooltipText: `In bigger populations, a sort of global thinking <br/> emerges, giving an additional multiplier. <br/> Scales ^3 with current population.`,
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	effect2 = new Effect({
    			props: {
    				factor: /*$totalMonsterDeathsLootBoost*/ ctx[19],
    				unlocked: /*$unlocked*/ ctx[0].cheeseMonsterTotalDeathsBoost,
    				tooltipText: `Scales ^2 with total deaths`,
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(effect0.$$.fragment);
    			t0 = space();
    			create_component(effect1.$$.fragment);
    			t1 = space();
    			create_component(effect2.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(effect0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(effect1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(effect2, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const effect0_changes = {};
    			if (dirty & /*$cheeseMonsterMassacreMultiplier*/ 131072) effect0_changes.factor = /*$cheeseMonsterMassacreMultiplier*/ ctx[17];
    			if (dirty & /*$unlocked*/ 1) effect0_changes.unlocked = /*$unlocked*/ ctx[0].cheeseMonsterMassacre;

    			if (dirty & /*$$scope*/ 268435456) {
    				effect0_changes.$$scope = { dirty, ctx };
    			}

    			effect0.$set(effect0_changes);
    			const effect1_changes = {};
    			if (dirty & /*$cheeseMonsterCollectiveSentienceMultiplier*/ 262144) effect1_changes.factor = /*$cheeseMonsterCollectiveSentienceMultiplier*/ ctx[18];
    			if (dirty & /*$unlocked*/ 1) effect1_changes.unlocked = /*$unlocked*/ ctx[0].cheeseMonsterCollectiveSentience;

    			if (dirty & /*$$scope*/ 268435456) {
    				effect1_changes.$$scope = { dirty, ctx };
    			}

    			effect1.$set(effect1_changes);
    			const effect2_changes = {};
    			if (dirty & /*$totalMonsterDeathsLootBoost*/ 524288) effect2_changes.factor = /*$totalMonsterDeathsLootBoost*/ ctx[19];
    			if (dirty & /*$unlocked*/ 1) effect2_changes.unlocked = /*$unlocked*/ ctx[0].cheeseMonsterTotalDeathsBoost;

    			if (dirty & /*$$scope*/ 268435456) {
    				effect2_changes.$$scope = { dirty, ctx };
    			}

    			effect2.$set(effect2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(effect0.$$.fragment, local);
    			transition_in(effect1.$$.fragment, local);
    			transition_in(effect2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(effect0.$$.fragment, local);
    			transition_out(effect1.$$.fragment, local);
    			transition_out(effect2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(effect0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(effect1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(effect2, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(158:8) <EffectComponent>",
    		ctx
    	});

    	return block;
    }

    // (20:0) <Window title="The Cheeseyard" themeColor1="rgb(82, 0, 18)" themeColor2="rgb(255, 0, 98)">
    function create_default_slot$2(ctx) {
    	let div0;
    	let span1;
    	let t0;
    	let t1_value = formatWhole(/*$resource*/ ctx[2].cheeseMonster) + "";
    	let t1;
    	let t2;
    	let t3_value = formatWhole(/*$cheeseMonsterCapacity*/ ctx[3]) + "";
    	let t3;
    	let t4;
    	let span0;
    	let t6;
    	let br0;
    	let t7;
    	let span2;
    	let t8;

    	let t9_value = (/*$cheeseMonsterSpawnrate*/ ctx[4] < 1
    	? `${formatWhole(/*$cheeseMonsterSpawnrate*/ ctx[4] * 60)}/min`
    	: `${formatNumber(/*$cheeseMonsterSpawnrate*/ ctx[4], 2)}/s`) + "";

    	let t9;
    	let t10;
    	let br1;
    	let t11;
    	let current_block_type_index;
    	let if_block0;
    	let t12;
    	let div2;
    	let current_block_type_index_1;
    	let if_block1;
    	let t13;
    	let div1;
    	let span3;
    	let t15;
    	let br2;
    	let t16;
    	let span4;
    	let t17;
    	let t18_value = formatNumber(/*$monsterThoughtMult*/ ctx[9], 2) + "";
    	let t18;
    	let t19;
    	let t20;
    	let br3;
    	let t21;
    	let span5;
    	let t22;
    	let if_block3_anchor;
    	let current;
    	const if_block_creators = [create_if_block_3$1, create_else_block_2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$totalCheeseMonsterDeaths*/ ctx[5] > 0) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	const if_block_creators_1 = [create_if_block_2$2, create_else_block_1];
    	const if_blocks_1 = [];

    	function select_block_type_1(ctx, dirty) {
    		if (!/*controllerUnlocked*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index_1 = select_block_type_1(ctx);
    	if_block1 = if_blocks_1[current_block_type_index_1] = if_block_creators_1[current_block_type_index_1](ctx);

    	function select_block_type_2(ctx, dirty) {
    		if (/*$upgrades*/ ctx[10].cheeseMonsterMoldiness.bought > 0) return create_if_block_1$3;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type_2(ctx);
    	let if_block2 = current_block_type(ctx);
    	let if_block3 = /*controllerUnlocked*/ ctx[1] && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			span1 = element("span");
    			t0 = text("Current population: ");
    			t1 = text(t1_value);
    			t2 = text("/");
    			t3 = text(t3_value);
    			t4 = space();
    			span0 = element("span");
    			span0.textContent = "cheese monsters";
    			t6 = space();
    			br0 = element("br");
    			t7 = space();
    			span2 = element("span");
    			t8 = text("Spawn rate: ");
    			t9 = text(t9_value);
    			t10 = space();
    			br1 = element("br");
    			t11 = space();
    			if_block0.c();
    			t12 = space();
    			div2 = element("div");
    			if_block1.c();
    			t13 = space();
    			div1 = element("div");
    			span3 = element("span");
    			span3.textContent = "Your current cheese monsters want to help you.";
    			t15 = space();
    			br2 = element("br");
    			t16 = space();
    			span4 = element("span");
    			t17 = text("⮞ thoughts/s are boosted by ");
    			t18 = text(t18_value);
    			t19 = text("x");
    			t20 = space();
    			br3 = element("br");
    			t21 = space();
    			span5 = element("span");
    			if_block2.c();
    			t22 = space();
    			if (if_block3) if_block3.c();
    			if_block3_anchor = empty();
    			set_style(span0, "font-weight", "bold");
    			attr_dev(span0, "class", "colorText svelte-17fki53");
    			add_location(span0, file$6, 23, 6, 1567);
    			add_location(br0, file$6, 23, 79, 1640);
    			attr_dev(span1, "class", "resourceDisplay");
    			add_location(span1, file$6, 21, 4, 1427);
    			add_location(br1, file$6, 29, 6, 1843);
    			add_location(span2, file$6, 25, 4, 1663);
    			set_style(div0, "display", "flex");
    			set_style(div0, "flex-direction", "column");
    			set_style(div0, "gap", "8px");
    			set_style(div0, "width", "var(--window-width)");
    			add_location(div0, file$6, 20, 2, 1332);
    			add_location(span3, file$6, 86, 6, 3826);
    			add_location(br2, file$6, 87, 6, 3892);
    			add_location(span4, file$6, 88, 6, 3905);
    			add_location(br3, file$6, 91, 6, 4008);
    			add_location(span5, file$6, 92, 6, 4021);
    			add_location(div1, file$6, 85, 4, 3814);
    			attr_dev(div2, "class", "flexRowContainer");
    			set_style(div2, "margin-top", "-8px");
    			add_location(div2, file$6, 46, 2, 2292);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, span1);
    			append_dev(span1, t0);
    			append_dev(span1, t1);
    			append_dev(span1, t2);
    			append_dev(span1, t3);
    			append_dev(span1, t4);
    			append_dev(span1, span0);
    			append_dev(span1, t6);
    			append_dev(span1, br0);
    			append_dev(div0, t7);
    			append_dev(div0, span2);
    			append_dev(span2, t8);
    			append_dev(span2, t9);
    			append_dev(span2, t10);
    			append_dev(span2, br1);
    			append_dev(span2, t11);
    			if_blocks[current_block_type_index].m(span2, null);
    			insert_dev(target, t12, anchor);
    			insert_dev(target, div2, anchor);
    			if_blocks_1[current_block_type_index_1].m(div2, null);
    			append_dev(div2, t13);
    			append_dev(div2, div1);
    			append_dev(div1, span3);
    			append_dev(div1, t15);
    			append_dev(div1, br2);
    			append_dev(div1, t16);
    			append_dev(div1, span4);
    			append_dev(span4, t17);
    			append_dev(span4, t18);
    			append_dev(span4, t19);
    			append_dev(div1, t20);
    			append_dev(div1, br3);
    			append_dev(div1, t21);
    			append_dev(div1, span5);
    			if_block2.m(span5, null);
    			insert_dev(target, t22, anchor);
    			if (if_block3) if_block3.m(target, anchor);
    			insert_dev(target, if_block3_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*$resource*/ 4) && t1_value !== (t1_value = formatWhole(/*$resource*/ ctx[2].cheeseMonster) + "")) set_data_dev(t1, t1_value);
    			if ((!current || dirty & /*$cheeseMonsterCapacity*/ 8) && t3_value !== (t3_value = formatWhole(/*$cheeseMonsterCapacity*/ ctx[3]) + "")) set_data_dev(t3, t3_value);

    			if ((!current || dirty & /*$cheeseMonsterSpawnrate*/ 16) && t9_value !== (t9_value = (/*$cheeseMonsterSpawnrate*/ ctx[4] < 1
    			? `${formatWhole(/*$cheeseMonsterSpawnrate*/ ctx[4] * 60)}/min`
    			: `${formatNumber(/*$cheeseMonsterSpawnrate*/ ctx[4], 2)}/s`) + "")) set_data_dev(t9, t9_value);

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block0 = if_blocks[current_block_type_index];

    				if (!if_block0) {
    					if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block0.c();
    				} else {
    					if_block0.p(ctx, dirty);
    				}

    				transition_in(if_block0, 1);
    				if_block0.m(span2, null);
    			}

    			let previous_block_index_1 = current_block_type_index_1;
    			current_block_type_index_1 = select_block_type_1(ctx);

    			if (current_block_type_index_1 === previous_block_index_1) {
    				if_blocks_1[current_block_type_index_1].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks_1[previous_block_index_1], 1, 1, () => {
    					if_blocks_1[previous_block_index_1] = null;
    				});

    				check_outros();
    				if_block1 = if_blocks_1[current_block_type_index_1];

    				if (!if_block1) {
    					if_block1 = if_blocks_1[current_block_type_index_1] = if_block_creators_1[current_block_type_index_1](ctx);
    					if_block1.c();
    				} else {
    					if_block1.p(ctx, dirty);
    				}

    				transition_in(if_block1, 1);
    				if_block1.m(div2, t13);
    			}

    			if ((!current || dirty & /*$monsterThoughtMult*/ 512) && t18_value !== (t18_value = formatNumber(/*$monsterThoughtMult*/ ctx[9], 2) + "")) set_data_dev(t18, t18_value);

    			if (current_block_type === (current_block_type = select_block_type_2(ctx)) && if_block2) {
    				if_block2.p(ctx, dirty);
    			} else {
    				if_block2.d(1);
    				if_block2 = current_block_type(ctx);

    				if (if_block2) {
    					if_block2.c();
    					if_block2.m(span5, null);
    				}
    			}

    			if (/*controllerUnlocked*/ ctx[1]) {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);

    					if (dirty & /*controllerUnlocked*/ 2) {
    						transition_in(if_block3, 1);
    					}
    				} else {
    					if_block3 = create_if_block$3(ctx);
    					if_block3.c();
    					transition_in(if_block3, 1);
    					if_block3.m(if_block3_anchor.parentNode, if_block3_anchor);
    				}
    			} else if (if_block3) {
    				group_outros();

    				transition_out(if_block3, 1, 1, () => {
    					if_block3 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(if_block3);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(if_block3);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if_blocks[current_block_type_index].d();
    			if (detaching) detach_dev(t12);
    			if (detaching) detach_dev(div2);
    			if_blocks_1[current_block_type_index_1].d();
    			if_block2.d();
    			if (detaching) detach_dev(t22);
    			if (if_block3) if_block3.d(detaching);
    			if (detaching) detach_dev(if_block3_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(20:0) <Window title=\\\"The Cheeseyard\\\" themeColor1=\\\"rgb(82, 0, 18)\\\" themeColor2=\\\"rgb(255, 0, 98)\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let window;
    	let current;

    	window = new Window({
    			props: {
    				title: "The Cheeseyard",
    				themeColor1: "rgb(82, 0, 18)",
    				themeColor2: "rgb(255, 0, 98)",
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(window.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(window, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const window_changes = {};

    			if (dirty & /*$$scope, $totalMonsterDeathsLootBoost, $unlocked, $cheeseMonsterCollectiveSentienceMultiplier, $cheeseMonsterMassacreMultiplier, $monsterMoldyCheeseFactor, $monsterThoughtFactor, $cheeseMonsterLootAmount, $cheeseMonsterDropRate, $approxCheeseBrainsPerSec, $resource, controllerUnlocked, $monsterMoldyCheeseMult, $upgrades, $monsterThoughtMult, $brainMode, $totalCheeseMonsterDeaths, $cheeseMonsterDeathrate, $cheeseMonsterDeathsPerSec, $cheeseMonsterSpawnrate, $cheeseMonsterCapacity*/ 269484031) {
    				window_changes.$$scope = { dirty, ctx };
    			}

    			window.$set(window_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(window.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(window.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(window, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const buyMaxUpgrades = false;

    function instance$6($$self, $$props, $$invalidate) {
    	let controllerUnlocked;
    	let $unlocked;
    	let $resource;
    	let $cheeseMonsterCapacity;
    	let $cheeseMonsterSpawnrate;
    	let $totalCheeseMonsterDeaths;
    	let $cheeseMonsterDeathrate;
    	let $cheeseMonsterDeathsPerSec;
    	let $brainMode;
    	let $monsterThoughtMult;
    	let $upgrades;
    	let $monsterMoldyCheeseMult;
    	let $approxCheeseBrainsPerSec;
    	let $cheeseMonsterDropRate;
    	let $cheeseMonsterLootAmount;
    	let $monsterThoughtFactor;
    	let $monsterMoldyCheeseFactor;
    	let $cheeseMonsterMassacreMultiplier;
    	let $cheeseMonsterCollectiveSentienceMultiplier;
    	let $totalMonsterDeathsLootBoost;
    	validate_store(unlocked, 'unlocked');
    	component_subscribe($$self, unlocked, $$value => $$invalidate(0, $unlocked = $$value));
    	validate_store(resource, 'resource');
    	component_subscribe($$self, resource, $$value => $$invalidate(2, $resource = $$value));
    	validate_store(cheeseMonsterCapacity, 'cheeseMonsterCapacity');
    	component_subscribe($$self, cheeseMonsterCapacity, $$value => $$invalidate(3, $cheeseMonsterCapacity = $$value));
    	validate_store(cheeseMonsterSpawnrate, 'cheeseMonsterSpawnrate');
    	component_subscribe($$self, cheeseMonsterSpawnrate, $$value => $$invalidate(4, $cheeseMonsterSpawnrate = $$value));
    	validate_store(totalCheeseMonsterDeaths, 'totalCheeseMonsterDeaths');
    	component_subscribe($$self, totalCheeseMonsterDeaths, $$value => $$invalidate(5, $totalCheeseMonsterDeaths = $$value));
    	validate_store(cheeseMonsterDeathrate, 'cheeseMonsterDeathrate');
    	component_subscribe($$self, cheeseMonsterDeathrate, $$value => $$invalidate(6, $cheeseMonsterDeathrate = $$value));
    	validate_store(cheeseMonsterDeathsPerSec, 'cheeseMonsterDeathsPerSec');
    	component_subscribe($$self, cheeseMonsterDeathsPerSec, $$value => $$invalidate(7, $cheeseMonsterDeathsPerSec = $$value));
    	validate_store(brainMode, 'brainMode');
    	component_subscribe($$self, brainMode, $$value => $$invalidate(8, $brainMode = $$value));
    	validate_store(monsterThoughtMult, 'monsterThoughtMult');
    	component_subscribe($$self, monsterThoughtMult, $$value => $$invalidate(9, $monsterThoughtMult = $$value));
    	validate_store(upgrades, 'upgrades');
    	component_subscribe($$self, upgrades, $$value => $$invalidate(10, $upgrades = $$value));
    	validate_store(monsterMoldyCheeseMult, 'monsterMoldyCheeseMult');
    	component_subscribe($$self, monsterMoldyCheeseMult, $$value => $$invalidate(11, $monsterMoldyCheeseMult = $$value));
    	validate_store(approxCheeseBrainsPerSec, 'approxCheeseBrainsPerSec');
    	component_subscribe($$self, approxCheeseBrainsPerSec, $$value => $$invalidate(12, $approxCheeseBrainsPerSec = $$value));
    	validate_store(cheeseMonsterDropRate, 'cheeseMonsterDropRate');
    	component_subscribe($$self, cheeseMonsterDropRate, $$value => $$invalidate(13, $cheeseMonsterDropRate = $$value));
    	validate_store(cheeseMonsterLootAmount, 'cheeseMonsterLootAmount');
    	component_subscribe($$self, cheeseMonsterLootAmount, $$value => $$invalidate(14, $cheeseMonsterLootAmount = $$value));
    	validate_store(monsterThoughtFactor, 'monsterThoughtFactor');
    	component_subscribe($$self, monsterThoughtFactor, $$value => $$invalidate(15, $monsterThoughtFactor = $$value));
    	validate_store(monsterMoldyCheeseFactor, 'monsterMoldyCheeseFactor');
    	component_subscribe($$self, monsterMoldyCheeseFactor, $$value => $$invalidate(16, $monsterMoldyCheeseFactor = $$value));
    	validate_store(cheeseMonsterMassacreMultiplier, 'cheeseMonsterMassacreMultiplier');
    	component_subscribe($$self, cheeseMonsterMassacreMultiplier, $$value => $$invalidate(17, $cheeseMonsterMassacreMultiplier = $$value));
    	validate_store(cheeseMonsterCollectiveSentienceMultiplier, 'cheeseMonsterCollectiveSentienceMultiplier');
    	component_subscribe($$self, cheeseMonsterCollectiveSentienceMultiplier, $$value => $$invalidate(18, $cheeseMonsterCollectiveSentienceMultiplier = $$value));
    	validate_store(totalMonsterDeathsLootBoost, 'totalMonsterDeathsLootBoost');
    	component_subscribe($$self, totalMonsterDeathsLootBoost, $$value => $$invalidate(19, $totalMonsterDeathsLootBoost = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CheeseyardComponent', slots, []);

    	function unlockBrainWaveController() {
    		if ($resource.cheeseMonster < 10) return;
    		set_store_value(unlocked, $unlocked.monsterBrainWaveController = true, $unlocked);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<CheeseyardComponent> was created with unknown prop '${key}'`);
    	});

    	const $$binding_groups = [[]];

    	function input0_change_handler() {
    		$brainMode = this.__value;
    		brainMode.set($brainMode);
    	}

    	function input1_change_handler() {
    		$brainMode = this.__value;
    		brainMode.set($brainMode);
    	}

    	function input2_change_handler() {
    		$brainMode = this.__value;
    		brainMode.set($brainMode);
    	}

    	const func = v => v.name === UnlockName.CHEESE_MONSTER_MASSACRE;
    	const func_1 = v => v.name === UnlockName.CHEESE_MONSTER_COLLECTIVE_SENTIENCE;
    	const func_2 = v => v.name === UnlockName.CHEESE_MONSTER_TOTAL_DEATHS_BOOST;

    	$$self.$capture_state = () => ({
    		Window,
    		formatNumber,
    		formatWhole,
    		tooltip,
    		UpgradeButton,
    		unlocks,
    		UnlockName,
    		monsterThoughtMult,
    		totalMonsterDeathsLootBoost,
    		monsterThoughtFactor,
    		cheeseMonsterSpawnrate,
    		cheeseMonsterDeathrate,
    		cheeseMonsterCapacity,
    		cheeseMonsterDropRate,
    		cheeseMonsterLootAmount,
    		monsterMoldyCheeseFactor,
    		monsterMoldyCheeseMult,
    		cheeseMonsterMassacreMultiplier,
    		cheeseMonsterDeathsPerSec,
    		cheeseMonsterCollectiveSentienceMultiplier,
    		brainMode,
    		totalCheeseMonsterDeaths,
    		approxCheeseBrainsPerSec,
    		resource,
    		upgrades,
    		unlocked,
    		fade,
    		UnlockDrawer,
    		EffectComponent,
    		Effect,
    		MonsterBrainWaveController,
    		buyMaxUpgrades,
    		unlockBrainWaveController,
    		controllerUnlocked,
    		$unlocked,
    		$resource,
    		$cheeseMonsterCapacity,
    		$cheeseMonsterSpawnrate,
    		$totalCheeseMonsterDeaths,
    		$cheeseMonsterDeathrate,
    		$cheeseMonsterDeathsPerSec,
    		$brainMode,
    		$monsterThoughtMult,
    		$upgrades,
    		$monsterMoldyCheeseMult,
    		$approxCheeseBrainsPerSec,
    		$cheeseMonsterDropRate,
    		$cheeseMonsterLootAmount,
    		$monsterThoughtFactor,
    		$monsterMoldyCheeseFactor,
    		$cheeseMonsterMassacreMultiplier,
    		$cheeseMonsterCollectiveSentienceMultiplier,
    		$totalMonsterDeathsLootBoost
    	});

    	$$self.$inject_state = $$props => {
    		if ('controllerUnlocked' in $$props) $$invalidate(1, controllerUnlocked = $$props.controllerUnlocked);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$unlocked*/ 1) {
    			$$invalidate(1, controllerUnlocked = $unlocked.monsterBrainWaveController);
    		}
    	};

    	return [
    		$unlocked,
    		controllerUnlocked,
    		$resource,
    		$cheeseMonsterCapacity,
    		$cheeseMonsterSpawnrate,
    		$totalCheeseMonsterDeaths,
    		$cheeseMonsterDeathrate,
    		$cheeseMonsterDeathsPerSec,
    		$brainMode,
    		$monsterThoughtMult,
    		$upgrades,
    		$monsterMoldyCheeseMult,
    		$approxCheeseBrainsPerSec,
    		$cheeseMonsterDropRate,
    		$cheeseMonsterLootAmount,
    		$monsterThoughtFactor,
    		$monsterMoldyCheeseFactor,
    		$cheeseMonsterMassacreMultiplier,
    		$cheeseMonsterCollectiveSentienceMultiplier,
    		$totalMonsterDeathsLootBoost,
    		unlockBrainWaveController,
    		input0_change_handler,
    		$$binding_groups,
    		input1_change_handler,
    		input2_change_handler,
    		func,
    		func_1,
    		func_2
    	];
    }

    class CheeseyardComponent extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CheeseyardComponent",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src/components/game-windows/MilkComponent.svelte generated by Svelte v3.44.1 */
    const file$5 = "src/components/game-windows/MilkComponent.svelte";

    // (89:0) <Window title="Milk" themeColor1="#bdbdbd" themeColor2="#ffffff">
    function create_default_slot$1(ctx) {
    	let div;
    	let span0;
    	let t0;
    	let t1_value = formatNumber(/*$resource*/ ctx[0].milk, 2) + "";
    	let t1;
    	let t2;
    	let strong;
    	let t4;
    	let br0;
    	let t5;
    	let span1;
    	let t6;
    	let br1;
    	let t7;
    	let br2;
    	let t8;

    	const block = {
    		c: function create() {
    			div = element("div");
    			span0 = element("span");
    			t0 = text("You have ");
    			t1 = text(t1_value);
    			t2 = space();
    			strong = element("strong");
    			strong.textContent = "milk";
    			t4 = space();
    			br0 = element("br");
    			t5 = space();
    			span1 = element("span");
    			t6 = text("This is the end of the demo! ");
    			br1 = element("br");
    			t7 = text("\n    Milk would/will be a prestige layer interacting with all of the stuff so far. ");
    			br2 = element("br");
    			t8 = text("\n    I would appreciate any feedback, suggestions, etc!");
    			set_style(strong, "color", "white");
    			attr_dev(strong, "class", "svelte-19km07z");
    			add_location(strong, file$5, 91, 50, 3225);
    			attr_dev(br0, "class", "svelte-19km07z");
    			add_location(br0, file$5, 91, 92, 3267);
    			attr_dev(span0, "class", "resourceDisplay svelte-19km07z");
    			add_location(span0, file$5, 90, 4, 3145);
    			attr_dev(div, "class", "svelte-19km07z");
    			add_location(div, file$5, 89, 2, 3135);
    			attr_dev(br1, "class", "svelte-19km07z");
    			add_location(br1, file$5, 96, 33, 3338);
    			attr_dev(br2, "class", "svelte-19km07z");
    			add_location(br2, file$5, 97, 82, 3427);
    			attr_dev(span1, "class", "svelte-19km07z");
    			add_location(span1, file$5, 95, 2, 3298);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span0);
    			append_dev(span0, t0);
    			append_dev(span0, t1);
    			append_dev(span0, t2);
    			append_dev(span0, strong);
    			append_dev(span0, t4);
    			append_dev(span0, br0);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, span1, anchor);
    			append_dev(span1, t6);
    			append_dev(span1, br1);
    			append_dev(span1, t7);
    			append_dev(span1, br2);
    			append_dev(span1, t8);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$resource*/ 1 && t1_value !== (t1_value = formatNumber(/*$resource*/ ctx[0].milk, 2) + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(span1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(89:0) <Window title=\\\"Milk\\\" themeColor1=\\\"#bdbdbd\\\" themeColor2=\\\"#ffffff\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let window;
    	let current;

    	window = new Window({
    			props: {
    				title: "Milk",
    				themeColor1: "#bdbdbd",
    				themeColor2: "#ffffff",
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(window.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(window, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const window_changes = {};

    			if (dirty & /*$$scope, $resource*/ 5) {
    				window_changes.$$scope = { dirty, ctx };
    			}

    			window.$set(window_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(window.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(window.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(window, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let $resource;
    	validate_store(resource, 'resource');
    	component_subscribe($$self, resource, $$value => $$invalidate(0, $resource = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MilkComponent', slots, []);

    	function handleMilkReset() {
    		const milkGain = Math.floor(get_store_value(milkFromReset));
    		if (milkGain < 1) return;
    		set_store_value(resource, $resource.milk += milkGain, $resource);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MilkComponent> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Window,
    		formatNumber,
    		formatWhole,
    		UpgradeButton,
    		get: get_store_value,
    		cummulativeUpgradesToTier,
    		milkFromReset,
    		milkPowerPerSec,
    		milkUpgradeEffect,
    		milkUpgradeTier,
    		highestMilk,
    		upgrades,
    		resource,
    		tooltip,
    		handleMilkReset,
    		$resource
    	});

    	return [$resource];
    }

    class MilkComponent extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MilkComponent",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src/components/game-windows/window-model/WindowOLD.svelte generated by Svelte v3.44.1 */
    const file$4 = "src/components/game-windows/window-model/WindowOLD.svelte";

    function create_fragment$4(ctx) {
    	let div2;
    	let div0;
    	let span;
    	let t0;
    	let t1;
    	let div1;
    	let div2_transition;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			span = element("span");
    			t0 = text(/*title*/ ctx[0]);
    			t1 = space();
    			div1 = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(span, "class", "windowTitle svelte-1feflxg");
    			add_location(span, file$4, 6, 4, 182);
    			attr_dev(div0, "class", "header svelte-1feflxg");
    			add_location(div0, file$4, 5, 2, 157);
    			attr_dev(div1, "class", "content svelte-1feflxg");
    			add_location(div1, file$4, 8, 2, 234);
    			attr_dev(div2, "class", "container svelte-1feflxg");
    			add_location(div2, file$4, 4, 0, 94);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, span);
    			append_dev(span, t0);
    			append_dev(div2, t1);
    			append_dev(div2, div1);

    			if (default_slot) {
    				default_slot.m(div1, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*title*/ 1) set_data_dev(t0, /*title*/ ctx[0]);

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[1],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[1])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[1], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);

    			add_render_callback(() => {
    				if (!div2_transition) div2_transition = create_bidirectional_transition(div2, fade, { duration: 1000 }, true);
    				div2_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			if (!div2_transition) div2_transition = create_bidirectional_transition(div2, fade, { duration: 1000 }, false);
    			div2_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (default_slot) default_slot.d(detaching);
    			if (detaching && div2_transition) div2_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('WindowOLD', slots, ['default']);
    	let { title = '' } = $$props;
    	const writable_props = ['title'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<WindowOLD> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('$$scope' in $$props) $$invalidate(1, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ fade, title });

    	$$self.$inject_state = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [title, $$scope, slots];
    }

    class WindowOLD extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { title: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "WindowOLD",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get title() {
    		throw new Error("<WindowOLD>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<WindowOLD>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/tooltips/FixedSizeTooltip.svelte generated by Svelte v3.44.1 */

    const file$3 = "src/components/tooltips/FixedSizeTooltip.svelte";

    function create_fragment$3(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			set_style(div, "top", /*rect*/ ctx[1].bottom + 10 + "px");
    			set_style(div, "left", "calc(" + (/*rect*/ ctx[1].left + /*rect*/ ctx[1].width / 2) + "px - var(--width)/2 - var(--padding))");
    			attr_dev(div, "class", "svelte-o0hwds");
    			add_location(div, file$3, 4, 0, 65);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			div.innerHTML = /*data*/ ctx[0];
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*data*/ 1) div.innerHTML = /*data*/ ctx[0];
    			if (dirty & /*rect*/ 2) {
    				set_style(div, "top", /*rect*/ ctx[1].bottom + 10 + "px");
    			}

    			if (dirty & /*rect*/ 2) {
    				set_style(div, "left", "calc(" + (/*rect*/ ctx[1].left + /*rect*/ ctx[1].width / 2) + "px - var(--width)/2 - var(--padding))");
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FixedSizeTooltip', slots, []);
    	let { data } = $$props;
    	let { rect } = $$props;
    	const writable_props = ['data', 'rect'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<FixedSizeTooltip> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('data' in $$props) $$invalidate(0, data = $$props.data);
    		if ('rect' in $$props) $$invalidate(1, rect = $$props.rect);
    	};

    	$$self.$capture_state = () => ({ data, rect });

    	$$self.$inject_state = $$props => {
    		if ('data' in $$props) $$invalidate(0, data = $$props.data);
    		if ('rect' in $$props) $$invalidate(1, rect = $$props.rect);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [data, rect];
    }

    class FixedSizeTooltip extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { data: 0, rect: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FixedSizeTooltip",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*data*/ ctx[0] === undefined && !('data' in props)) {
    			console.warn("<FixedSizeTooltip> was created without expected prop 'data'");
    		}

    		if (/*rect*/ ctx[1] === undefined && !('rect' in props)) {
    			console.warn("<FixedSizeTooltip> was created without expected prop 'rect'");
    		}
    	}

    	get data() {
    		throw new Error("<FixedSizeTooltip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<FixedSizeTooltip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rect() {
    		throw new Error("<FixedSizeTooltip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rect(value) {
    		throw new Error("<FixedSizeTooltip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/game-windows/MilkTreeComponent.svelte generated by Svelte v3.44.1 */

    const { Error: Error_1 } = globals;
    const file$2 = "src/components/game-windows/MilkTreeComponent.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[10] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[13] = list[i];
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[16] = list[i];
    	child_ctx[17] = list;
    	child_ctx[18] = i;
    	return child_ctx;
    }

    function get_each_context_3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[19] = list[i];
    	child_ctx[21] = i;
    	return child_ctx;
    }

    // (90:8) {#each skillTreeRow as boost, j}
    function create_each_block_3(ctx) {
    	let div1;
    	let button;
    	let span0;
    	let t0_value = /*boost*/ ctx[19].label + "";
    	let t0;
    	let t1;
    	let br;
    	let t2;
    	let span1;
    	let t3_value = /*boost*/ ctx[19].cost + "";
    	let t3;
    	let t4;
    	let button_disabled_value;
    	let tooltip_action;
    	let t5;
    	let div0;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[5](/*i*/ ctx[18], /*j*/ ctx[21]);
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			button = element("button");
    			span0 = element("span");
    			t0 = text(t0_value);
    			t1 = space();
    			br = element("br");
    			t2 = space();
    			span1 = element("span");
    			t3 = text(t3_value);
    			t4 = text(" MP");
    			t5 = space();
    			div0 = element("div");
    			attr_dev(br, "class", "svelte-r4z16k");
    			add_location(br, file$2, 97, 34, 4179);
    			attr_dev(span0, "class", "svelte-r4z16k");
    			add_location(span0, file$2, 97, 14, 4159);
    			attr_dev(span1, "class", "svelte-r4z16k");
    			add_location(span1, file$2, 98, 14, 4207);
    			button.disabled = button_disabled_value = !/*boost*/ ctx[19].available;
    			attr_dev(button, "class", "svelte-r4z16k");
    			toggle_class(button, "activated", /*boost*/ ctx[19].activated);
    			add_location(button, file$2, 91, 12, 3898);
    			attr_dev(div0, "class", "backDrop svelte-r4z16k");
    			add_location(div0, file$2, 100, 12, 4270);
    			set_style(div1, "position", "relative");
    			attr_dev(div1, "class", "svelte-r4z16k");
    			add_location(div1, file$2, 90, 10, 3854);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, button);
    			append_dev(button, span0);
    			append_dev(span0, t0);
    			append_dev(span0, t1);
    			append_dev(span0, br);
    			append_dev(button, t2);
    			append_dev(button, span1);
    			append_dev(span1, t3);
    			append_dev(span1, t4);
    			append_dev(div1, t5);
    			append_dev(div1, div0);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button, "click", click_handler, false, false, false),
    					action_destroyer(tooltip_action = tooltip.call(null, button, {
    						Component: FixedSizeTooltip,
    						data: /*boost*/ ctx[19].description
    					}))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*skillTree*/ 1 && t0_value !== (t0_value = /*boost*/ ctx[19].label + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*skillTree*/ 1 && t3_value !== (t3_value = /*boost*/ ctx[19].cost + "")) set_data_dev(t3, t3_value);

    			if (dirty & /*skillTree*/ 1 && button_disabled_value !== (button_disabled_value = !/*boost*/ ctx[19].available)) {
    				prop_dev(button, "disabled", button_disabled_value);
    			}

    			if (tooltip_action && is_function(tooltip_action.update) && dirty & /*skillTree*/ 1) tooltip_action.update.call(null, {
    				Component: FixedSizeTooltip,
    				data: /*boost*/ ctx[19].description
    			});

    			if (dirty & /*skillTree*/ 1) {
    				toggle_class(button, "activated", /*boost*/ ctx[19].activated);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_3.name,
    		type: "each",
    		source: "(90:8) {#each skillTreeRow as boost, j}",
    		ctx
    	});

    	return block;
    }

    // (88:4) {#each skillTree as skillTreeRow, i}
    function create_each_block_2(ctx) {
    	let div;
    	let t;
    	let i = /*i*/ ctx[18];
    	let each_value_3 = /*skillTreeRow*/ ctx[16];
    	validate_each_argument(each_value_3);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_3.length; i += 1) {
    		each_blocks[i] = create_each_block_3(get_each_context_3(ctx, each_value_3, i));
    	}

    	const assign_div = () => /*div_binding*/ ctx[6](div, i);
    	const unassign_div = () => /*div_binding*/ ctx[6](null, i);

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			attr_dev(div, "class", "skillTreeRow svelte-r4z16k");
    			add_location(div, file$2, 88, 6, 3756);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			append_dev(div, t);
    			assign_div();
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*skillTree, FixedSizeTooltip, handleButton*/ 17) {
    				each_value_3 = /*skillTreeRow*/ ctx[16];
    				validate_each_argument(each_value_3);
    				let i;

    				for (i = 0; i < each_value_3.length; i += 1) {
    					const child_ctx = get_each_context_3(ctx, each_value_3, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, t);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_3.length;
    			}

    			if (i !== /*i*/ ctx[18]) {
    				unassign_div();
    				i = /*i*/ ctx[18];
    				assign_div();
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    			unassign_div();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(88:4) {#each skillTree as skillTreeRow, i}",
    		ctx
    	});

    	return block;
    }

    // (109:4) {#if connections}
    function create_if_block$2(ctx) {
    	let each_1_anchor;
    	let each_value = /*connections*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*connections*/ 4) {
    				each_value = /*connections*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(109:4) {#if connections}",
    		ctx
    	});

    	return block;
    }

    // (112:10) {#if connection.allowed}
    function create_if_block_1$2(ctx) {
    	let line;
    	let line_x__value;
    	let line_y__value;
    	let line_x__value_1;
    	let line_y__value_1;
    	let line_stroke_value;

    	const block = {
    		c: function create() {
    			line = svg_element("line");
    			attr_dev(line, "x1", line_x__value = /*connection*/ ctx[13].start.x);
    			attr_dev(line, "y1", line_y__value = /*connection*/ ctx[13].start.y);
    			attr_dev(line, "x2", line_x__value_1 = /*connection*/ ctx[13].end.x);
    			attr_dev(line, "y2", line_y__value_1 = /*connection*/ ctx[13].end.y);

    			attr_dev(line, "stroke", line_stroke_value = /*connection*/ ctx[13].active
    			? 'var(--activatedColor)'
    			: 'var(--Gray800)');

    			attr_dev(line, "stroke-width", "5");
    			attr_dev(line, "shape-rendering", "geometricPrecision");
    			attr_dev(line, "class", "svelte-r4z16k");
    			add_location(line, file$2, 112, 12, 4531);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, line, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*connections*/ 4 && line_x__value !== (line_x__value = /*connection*/ ctx[13].start.x)) {
    				attr_dev(line, "x1", line_x__value);
    			}

    			if (dirty & /*connections*/ 4 && line_y__value !== (line_y__value = /*connection*/ ctx[13].start.y)) {
    				attr_dev(line, "y1", line_y__value);
    			}

    			if (dirty & /*connections*/ 4 && line_x__value_1 !== (line_x__value_1 = /*connection*/ ctx[13].end.x)) {
    				attr_dev(line, "x2", line_x__value_1);
    			}

    			if (dirty & /*connections*/ 4 && line_y__value_1 !== (line_y__value_1 = /*connection*/ ctx[13].end.y)) {
    				attr_dev(line, "y2", line_y__value_1);
    			}

    			if (dirty & /*connections*/ 4 && line_stroke_value !== (line_stroke_value = /*connection*/ ctx[13].active
    			? 'var(--activatedColor)'
    			: 'var(--Gray800)')) {
    				attr_dev(line, "stroke", line_stroke_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(line);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(112:10) {#if connection.allowed}",
    		ctx
    	});

    	return block;
    }

    // (111:8) {#each connectionLayer as connection}
    function create_each_block_1(ctx) {
    	let if_block_anchor;
    	let if_block = /*connection*/ ctx[13].allowed && create_if_block_1$2(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*connection*/ ctx[13].allowed) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1$2(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(111:8) {#each connectionLayer as connection}",
    		ctx
    	});

    	return block;
    }

    // (110:6) {#each connections as connectionLayer}
    function create_each_block$1(ctx) {
    	let each_1_anchor;
    	let each_value_1 = /*connectionLayer*/ ctx[10];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*connections*/ 4) {
    				each_value_1 = /*connectionLayer*/ ctx[10];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(110:6) {#each connections as connectionLayer}",
    		ctx
    	});

    	return block;
    }

    // (73:0) <Window title="The Milk Tree" --bg="linear-gradient(90deg, #bdbdbd 0%, #ffffff 100%)">
    function create_default_slot(ctx) {
    	let div0;
    	let span0;
    	let t0;
    	let t1_value = formatNumber(/*$resource*/ ctx[3].milkPoints, 2) + "";
    	let t1;
    	let t2;
    	let strong;
    	let t4;
    	let br0;
    	let t5;
    	let span1;
    	let t8;
    	let div1;
    	let button0;
    	let t9;
    	let br1;
    	let t10;
    	let t11_value = 1 + "";
    	let t11;
    	let t12;
    	let t13;
    	let button1;
    	let t14;
    	let br2;
    	let t15;
    	let t16_value = 1 + "";
    	let t16;
    	let t17;
    	let t18;
    	let button2;
    	let t19;
    	let br3;
    	let t20;
    	let t21_value = 1 + "";
    	let t21;
    	let t22;
    	let t23;
    	let div2;
    	let t24;
    	let svg;
    	let each_value_2 = /*skillTree*/ ctx[0];
    	validate_each_argument(each_value_2);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	let if_block = /*connections*/ ctx[2] && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			span0 = element("span");
    			t0 = text("You have ");
    			t1 = text(t1_value);
    			t2 = text(" unspent ");
    			strong = element("strong");
    			strong.textContent = "milk points";
    			t4 = space();
    			br0 = element("br");
    			t5 = space();
    			span1 = element("span");
    			span1.textContent = `Total: ${16}`;
    			t8 = space();
    			div1 = element("div");
    			button0 = element("button");
    			t9 = text("Gain 1 milk point ");
    			br1 = element("br");
    			t10 = text(" Cost: ");
    			t11 = text(t11_value);
    			t12 = text(" thoughts");
    			t13 = space();
    			button1 = element("button");
    			t14 = text("Gain 1 milk point ");
    			br2 = element("br");
    			t15 = text(" Cost: ");
    			t16 = text(t16_value);
    			t17 = text(" cheese");
    			t18 = space();
    			button2 = element("button");
    			t19 = text("Gain 1 milk point ");
    			br3 = element("br");
    			t20 = text(" Cost: ");
    			t21 = text(t21_value);
    			t22 = text(" milk");
    			t23 = space();
    			div2 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t24 = space();
    			svg = svg_element("svg");
    			if (if_block) if_block.c();
    			set_style(strong, "color", "white");
    			attr_dev(strong, "class", "svelte-r4z16k");
    			add_location(strong, file$2, 75, 64, 3345);
    			attr_dev(br0, "class", "svelte-r4z16k");
    			add_location(br0, file$2, 75, 114, 3395);
    			attr_dev(span0, "class", "resourceDisplay svelte-r4z16k");
    			add_location(span0, file$2, 74, 4, 3251);
    			attr_dev(span1, "class", "svelte-r4z16k");
    			add_location(span1, file$2, 77, 4, 3418);
    			attr_dev(div0, "class", "svelte-r4z16k");
    			add_location(div0, file$2, 73, 2, 3241);
    			attr_dev(br1, "class", "svelte-r4z16k");
    			add_location(br1, file$2, 81, 31, 3513);
    			attr_dev(button0, "class", "svelte-r4z16k");
    			add_location(button0, file$2, 81, 4, 3486);
    			attr_dev(br2, "class", "svelte-r4z16k");
    			add_location(br2, file$2, 82, 31, 3579);
    			attr_dev(button1, "class", "svelte-r4z16k");
    			add_location(button1, file$2, 82, 4, 3552);
    			attr_dev(br3, "class", "svelte-r4z16k");
    			add_location(br3, file$2, 83, 31, 3644);
    			attr_dev(button2, "class", "svelte-r4z16k");
    			add_location(button2, file$2, 83, 4, 3617);
    			attr_dev(div1, "class", "btnContainer svelte-r4z16k");
    			add_location(div1, file$2, 80, 2, 3455);
    			attr_dev(div2, "id", "skillTree");
    			attr_dev(div2, "class", "svelte-r4z16k");
    			add_location(div2, file$2, 86, 2, 3688);
    			attr_dev(svg, "class", "svelte-r4z16k");
    			add_location(svg, file$2, 107, 2, 4365);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, span0);
    			append_dev(span0, t0);
    			append_dev(span0, t1);
    			append_dev(span0, t2);
    			append_dev(span0, strong);
    			append_dev(span0, t4);
    			append_dev(span0, br0);
    			append_dev(div0, t5);
    			append_dev(div0, span1);
    			insert_dev(target, t8, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, button0);
    			append_dev(button0, t9);
    			append_dev(button0, br1);
    			append_dev(button0, t10);
    			append_dev(button0, t11);
    			append_dev(button0, t12);
    			append_dev(div1, t13);
    			append_dev(div1, button1);
    			append_dev(button1, t14);
    			append_dev(button1, br2);
    			append_dev(button1, t15);
    			append_dev(button1, t16);
    			append_dev(button1, t17);
    			append_dev(div1, t18);
    			append_dev(div1, button2);
    			append_dev(button2, t19);
    			append_dev(button2, br3);
    			append_dev(button2, t20);
    			append_dev(button2, t21);
    			append_dev(button2, t22);
    			insert_dev(target, t23, anchor);
    			insert_dev(target, div2, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div2, null);
    			}

    			insert_dev(target, t24, anchor);
    			insert_dev(target, svg, anchor);
    			if (if_block) if_block.m(svg, null);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$resource*/ 8 && t1_value !== (t1_value = formatNumber(/*$resource*/ ctx[3].milkPoints, 2) + "")) set_data_dev(t1, t1_value);

    			if (dirty & /*rows, skillTree, FixedSizeTooltip, handleButton*/ 19) {
    				each_value_2 = /*skillTree*/ ctx[0];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div2, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_2.length;
    			}

    			if (/*connections*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					if_block.m(svg, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t8);
    			if (detaching) detach_dev(div1);
    			if (detaching) detach_dev(t23);
    			if (detaching) detach_dev(div2);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t24);
    			if (detaching) detach_dev(svg);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(73:0) <Window title=\\\"The Milk Tree\\\" --bg=\\\"linear-gradient(90deg, #bdbdbd 0%, #ffffff 100%)\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let window;
    	let div;
    	let current;

    	window = new WindowOLD({
    			props: {
    				title: "The Milk Tree",
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(window.$$.fragment);
    			set_style(div, "display", "contents");
    			set_style(div, "--bg", "linear-gradient(90deg, #bdbdbd 0%, #ffffff 100%)");
    		},
    		l: function claim(nodes) {
    			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(window, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const window_changes = {};

    			if (dirty & /*$$scope, connections, skillTree, rows, $resource*/ 4194319) {
    				window_changes.$$scope = { dirty, ctx };
    			}

    			window.$set(window_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(window.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(window.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(window, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let $resource;
    	validate_store(resource, 'resource');
    	component_subscribe($$self, resource, $$value => $$invalidate(3, $resource = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MilkTreeComponent', slots, []);
    	const rows = [];
    	const connections = [];

    	onMount(() => {
    		for (let i = 0; i < rows.length - 1; i++) {
    			for (const [startIndex, startNode] of Array.from(rows[i].children).entries()) {
    				// console.log(startNode, startNode.id)
    				const start = startNode;

    				for (const [endIndex, endNode] of Array.from(rows[i + 1].children).entries()) {
    					const end = endNode;
    					if (connections[i] === undefined) $$invalidate(2, connections[i] = [], connections);
    					const id = i.toString() + startIndex.toString() + endIndex.toString();
    					const allowed = allowedSkillTreeConnections.includes(id);

    					connections[i].push({
    						id,
    						start: {
    							x: start.offsetLeft + start.offsetWidth / 2,
    							y: start.offsetTop + start.offsetHeight / 2
    						},
    						end: {
    							x: end.offsetLeft + end.offsetWidth / 2,
    							y: end.offsetTop + end.offsetHeight / 2
    						},
    						allowed,
    						active: false
    					});
    				}
    			}
    		}

    		updateSkillTreeButtons();
    	});

    	function updateSkillTreeButtons() {
    		for (const [i, skillRow] of skillTree.entries()) {
    			for (const [j] of skillRow.entries()) {
    				if (isBtnEnabled(i, j)) $$invalidate(0, skillTree[i][j].available = true, skillTree);
    			}
    		}
    	}

    	function isBtnEnabled(i, j) {
    		if (i < 1) return true;
    		const neccessaryConnectionIds = allowedSkillTreeConnections.filter(ac => ac[0] === (i - 1).toString() && ac[2] === j.toString());
    		const neccessaryConnections = connections[i - 1].filter(c => neccessaryConnectionIds.find(v => v === c.id));
    		const allConnectionsActive = neccessaryConnections.every(c => c.active);

    		// console.log(neccessaryConnections, allConnectionsActive)
    		return allConnectionsActive;
    	}

    	/**
     * kinda useless, just access index1 & index2 manually instead
     * @param connectionToActivate
     */
    	function toggleConnection(connectionToToggle, setActive) {
    		if (!allowedSkillTreeConnections.includes(connectionToToggle)) throw new Error(connectionToToggle + ' is not an allowed connection between MP boosts!');
    		const index1 = connectionToToggle[0];
    		const index2 = connections[index1].findIndex(c => c.id === connectionToToggle);
    		$$invalidate(2, connections[index1][index2].active = setActive, connections);
    	}

    	function handleButton(row, nth) {
    		if (!skillTree[row][nth].available) return;

    		if (!skillTree[row][nth].activated) {
    			const connectionsToActivate = allowedSkillTreeConnections.filter(c => c[0] === row.toString() && c[1] === nth.toString());
    			for (const connection of connectionsToActivate) toggleConnection(connection, true);
    			$$invalidate(0, skillTree[row][nth].activated = true, skillTree);
    		}

    		updateSkillTreeButtons();
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MilkTreeComponent> was created with unknown prop '${key}'`);
    	});

    	const click_handler = (i, j) => handleButton(i, j);

    	function div_binding($$value, i) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			rows[i] = $$value;
    			$$invalidate(1, rows);
    		});
    	}

    	$$self.$capture_state = () => ({
    		Window: WindowOLD,
    		formatNumber,
    		tooltip,
    		FixedSizeTooltip,
    		resource,
    		skillTree,
    		allowedSkillTreeConnections,
    		onMount,
    		rows,
    		connections,
    		updateSkillTreeButtons,
    		isBtnEnabled,
    		toggleConnection,
    		handleButton,
    		$resource
    	});

    	return [
    		skillTree,
    		rows,
    		connections,
    		$resource,
    		handleButton,
    		click_handler,
    		div_binding
    	];
    }

    class MilkTreeComponent extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MilkTreeComponent",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/components/misc/Log.svelte generated by Svelte v3.44.1 */

    const file$1 = "src/components/misc/Log.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (8:6) {#each logTypes as logType}
    function create_each_block(ctx) {
    	let li;
    	let div;
    	let t0_value = /*logType*/ ctx[3] + "";
    	let t0;
    	let t1;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[2](/*logType*/ ctx[3]);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			div = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(div, "class", "svelte-3b78b0");
    			toggle_class(div, "active", /*logType*/ ctx[3] === /*active*/ ctx[0]);
    			add_location(div, file$1, 13, 10, 301);
    			attr_dev(li, "class", "svelte-3b78b0");
    			add_location(li, file$1, 8, 8, 202);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, div);
    			append_dev(div, t0);
    			append_dev(li, t1);

    			if (!mounted) {
    				dispose = listen_dev(li, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*logTypes, active*/ 3) {
    				toggle_class(div, "active", /*logType*/ ctx[3] === /*active*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(8:6) {#each logTypes as logType}",
    		ctx
    	});

    	return block;
    }

    // (25:40) 
    function create_if_block_2$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Achievement stuff");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(25:40) ",
    		ctx
    	});

    	return block;
    }

    // (23:36) 
    function create_if_block_1$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Prestige stuff");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(23:36) ",
    		ctx
    	});

    	return block;
    }

    // (21:4) {#if active === 'Log'}
    function create_if_block$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Empty");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(21:4) {#if active === 'Log'}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div2;
    	let div0;
    	let ul;
    	let t;
    	let div1;
    	let each_value = /*logTypes*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	function select_block_type(ctx, dirty) {
    		if (/*active*/ ctx[0] === 'Log') return create_if_block$1;
    		if (/*active*/ ctx[0] === 'Prestige') return create_if_block_1$1;
    		if (/*active*/ ctx[0] === 'Achievements') return create_if_block_2$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type && current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			div1 = element("div");
    			if (if_block) if_block.c();
    			attr_dev(ul, "class", "svelte-3b78b0");
    			add_location(ul, file$1, 6, 4, 153);
    			attr_dev(div0, "class", "tabs svelte-3b78b0");
    			add_location(div0, file$1, 5, 2, 129);
    			attr_dev(div1, "id", "logText");
    			attr_dev(div1, "class", "svelte-3b78b0");
    			add_location(div1, file$1, 19, 2, 412);
    			attr_dev(div2, "id", "log");
    			attr_dev(div2, "class", "svelte-3b78b0");
    			add_location(div2, file$1, 4, 0, 111);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			append_dev(div2, t);
    			append_dev(div2, div1);
    			if (if_block) if_block.m(div1, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*active, logTypes*/ 3) {
    				each_value = /*logTypes*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
    				if (if_block) if_block.d(1);
    				if_block = current_block_type && current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div1, null);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_each(each_blocks, detaching);

    			if (if_block) {
    				if_block.d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Log', slots, []);
    	const logTypes = ['Log', 'Prestige', 'Achievements'];
    	let active = logTypes[0];
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Log> was created with unknown prop '${key}'`);
    	});

    	const click_handler = logType => {
    		$$invalidate(0, active = logType);
    	};

    	$$self.$capture_state = () => ({ logTypes, active });

    	$$self.$inject_state = $$props => {
    		if ('active' in $$props) $$invalidate(0, active = $$props.active);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [active, logTypes, click_handler];
    }

    class Log extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Log",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.44.1 */

    const { Object: Object_1, console: console_1 } = globals;
    const file = "src/App.svelte";

    // (242:2) {#if unlockTogglesShown}
    function create_if_block_4(ctx) {
    	let toggleunlocks;
    	let current;
    	toggleunlocks = new ToggleUnlocks({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(toggleunlocks.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(toggleunlocks, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(toggleunlocks.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(toggleunlocks.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(toggleunlocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(242:2) {#if unlockTogglesShown}",
    		ctx
    	});

    	return block;
    }

    // (269:6) {#if $unlocked.switzerland || $LORCA_OVERRIDE}
    function create_if_block_3(ctx) {
    	let div;
    	let cheesecomponent;
    	let current;
    	cheesecomponent = new CheeseComponent({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(cheesecomponent.$$.fragment);
    			attr_dev(div, "id", "cheeseComponent");
    			attr_dev(div, "class", "svelte-10tcx0r");
    			add_location(div, file, 269, 8, 11370);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(cheesecomponent, div, null);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(cheesecomponent.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(cheesecomponent.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(cheesecomponent);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(269:6) {#if $unlocked.switzerland || $LORCA_OVERRIDE}",
    		ctx
    	});

    	return block;
    }

    // (272:6) {#if $unlocked.moldyCheese || $LORCA_OVERRIDE}
    function create_if_block_2(ctx) {
    	let div;
    	let moldycheesecomponent;
    	let current;
    	moldycheesecomponent = new MoldyCheeseComponent({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(moldycheesecomponent.$$.fragment);
    			attr_dev(div, "id", "moldyCheeseComponent");
    			attr_dev(div, "class", "svelte-10tcx0r");
    			add_location(div, file, 272, 8, 11498);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(moldycheesecomponent, div, null);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(moldycheesecomponent.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(moldycheesecomponent.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(moldycheesecomponent);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(272:6) {#if $unlocked.moldyCheese || $LORCA_OVERRIDE}",
    		ctx
    	});

    	return block;
    }

    // (275:6) {#if $unlocked.cheeseyard || $LORCA_OVERRIDE}
    function create_if_block_1(ctx) {
    	let div;
    	let cheeseyardcomponent;
    	let current;
    	cheeseyardcomponent = new CheeseyardComponent({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(cheeseyardcomponent.$$.fragment);
    			attr_dev(div, "id", "cheeseyardComponent");
    			attr_dev(div, "class", "svelte-10tcx0r");
    			add_location(div, file, 275, 8, 11635);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(cheeseyardcomponent, div, null);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(cheeseyardcomponent.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(cheeseyardcomponent.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(cheeseyardcomponent);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(275:6) {#if $unlocked.cheeseyard || $LORCA_OVERRIDE}",
    		ctx
    	});

    	return block;
    }

    // (278:6) {#if $unlocked.milk || $LORCA_OVERRIDE}
    function create_if_block(ctx) {
    	let div;
    	let milkcomponent;
    	let current;
    	milkcomponent = new MilkComponent({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(milkcomponent.$$.fragment);
    			attr_dev(div, "id", "milkComponent");
    			attr_dev(div, "class", "svelte-10tcx0r");
    			add_location(div, file, 278, 8, 11764);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(milkcomponent, div, null);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(milkcomponent.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(milkcomponent.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(milkcomponent);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(278:6) {#if $unlocked.milk || $LORCA_OVERRIDE}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let devtools;
    	let t0;
    	let t1;
    	let notifications;
    	let t2;
    	let div0;
    	let button0;
    	let t3;
    	let t4_value = (/*isDarkMode*/ ctx[4] ? 'Dark' : 'Light') + "";
    	let t4;
    	let t5;
    	let button1;
    	let t7;
    	let button2;
    	let t9;
    	let button3;
    	let t11;
    	let div3;
    	let img;
    	let img_src_value;
    	let t12;
    	let div2;
    	let div1;
    	let thoughtcomponent;
    	let t13;
    	let t14;
    	let t15;
    	let t16;
    	let current;
    	let mounted;
    	let dispose;
    	devtools = new DevTools({ $$inline: true });
    	let if_block0 = /*unlockTogglesShown*/ ctx[3] && create_if_block_4(ctx);
    	notifications = new Notifications({ $$inline: true });
    	thoughtcomponent = new ThoughtComponent({ $$inline: true });
    	let if_block1 = (/*$unlocked*/ ctx[6].switzerland || /*$LORCA_OVERRIDE*/ ctx[5]) && create_if_block_3(ctx);
    	let if_block2 = (/*$unlocked*/ ctx[6].moldyCheese || /*$LORCA_OVERRIDE*/ ctx[5]) && create_if_block_2(ctx);
    	let if_block3 = (/*$unlocked*/ ctx[6].cheeseyard || /*$LORCA_OVERRIDE*/ ctx[5]) && create_if_block_1(ctx);
    	let if_block4 = (/*$unlocked*/ ctx[6].milk || /*$LORCA_OVERRIDE*/ ctx[5]) && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(devtools.$$.fragment);
    			t0 = space();
    			if (if_block0) if_block0.c();
    			t1 = space();
    			create_component(notifications.$$.fragment);
    			t2 = space();
    			div0 = element("div");
    			button0 = element("button");
    			t3 = text("Theme: ");
    			t4 = text(t4_value);
    			t5 = space();
    			button1 = element("button");
    			button1.textContent = "Home";
    			t7 = space();
    			button2 = element("button");
    			button2.textContent = "Save";
    			t9 = space();
    			button3 = element("button");
    			button3.textContent = "Reset";
    			t11 = space();
    			div3 = element("div");
    			img = element("img");
    			t12 = space();
    			div2 = element("div");
    			div1 = element("div");
    			create_component(thoughtcomponent.$$.fragment);
    			t13 = space();
    			if (if_block1) if_block1.c();
    			t14 = space();
    			if (if_block2) if_block2.c();
    			t15 = space();
    			if (if_block3) if_block3.c();
    			t16 = space();
    			if (if_block4) if_block4.c();
    			attr_dev(button0, "class", "svelte-10tcx0r");
    			add_location(button0, file, 248, 4, 10479);
    			attr_dev(button1, "class", "svelte-10tcx0r");
    			add_location(button1, file, 249, 4, 10563);
    			attr_dev(button2, "class", "svelte-10tcx0r");
    			add_location(button2, file, 253, 4, 10786);
    			attr_dev(button3, "class", "svelte-10tcx0r");
    			add_location(button3, file, 254, 4, 10837);
    			attr_dev(div0, "id", "saveload");
    			attr_dev(div0, "class", "svelte-10tcx0r");
    			add_location(div0, file, 247, 2, 10454);
    			if (!src_url_equal(img.src, img_src_value = "assets/thonk.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "thonk");
    			attr_dev(img, "draggable", "false");
    			set_style(img, "position", "absolute");
    			set_style(img, "left", "-1500px");
    			set_style(img, "top", "-800px");
    			set_style(img, "scale", "0.25");
    			attr_dev(img, "class", "svelte-10tcx0r");
    			add_location(img, file, 259, 4, 11009);
    			attr_dev(div1, "id", "thoughtComponent");
    			attr_dev(div1, "class", "svelte-10tcx0r");
    			add_location(div1, file, 267, 6, 11253);
    			attr_dev(div2, "id", "game");
    			attr_dev(div2, "class", "svelte-10tcx0r");
    			add_location(div2, file, 266, 4, 11207);
    			attr_dev(div3, "id", "display");
    			attr_dev(div3, "class", "svelte-10tcx0r");
    			add_location(div3, file, 258, 2, 10962);
    			attr_dev(main, "class", "svelte-10tcx0r");
    			add_location(main, file, 239, 0, 10268);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(devtools, main, null);
    			append_dev(main, t0);
    			if (if_block0) if_block0.m(main, null);
    			append_dev(main, t1);
    			mount_component(notifications, main, null);
    			append_dev(main, t2);
    			append_dev(main, div0);
    			append_dev(div0, button0);
    			append_dev(button0, t3);
    			append_dev(button0, t4);
    			append_dev(div0, t5);
    			append_dev(div0, button1);
    			append_dev(div0, t7);
    			append_dev(div0, button2);
    			append_dev(div0, t9);
    			append_dev(div0, button3);
    			append_dev(main, t11);
    			append_dev(main, div3);
    			append_dev(div3, img);
    			/*img_binding*/ ctx[9](img);
    			append_dev(div3, t12);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			mount_component(thoughtcomponent, div1, null);
    			append_dev(div2, t13);
    			if (if_block1) if_block1.m(div2, null);
    			append_dev(div2, t14);
    			if (if_block2) if_block2.m(div2, null);
    			append_dev(div2, t15);
    			if (if_block3) if_block3.m(div2, null);
    			append_dev(div2, t16);
    			if (if_block4) if_block4.m(div2, null);
    			/*div2_binding*/ ctx[10](div2);
    			/*div3_binding*/ ctx[11](div3);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*switchTheme*/ ctx[8], false, false, false),
    					listen_dev(button1, "click", /*returnToHome*/ ctx[7], false, false, false),
    					listen_dev(button2, "click", saveSaveGame, false, false, false),
    					listen_dev(button3, "click", resetSaveGame, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*unlockTogglesShown*/ ctx[3]) {
    				if (if_block0) {
    					if (dirty[0] & /*unlockTogglesShown*/ 8) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_4(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(main, t1);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if ((!current || dirty[0] & /*isDarkMode*/ 16) && t4_value !== (t4_value = (/*isDarkMode*/ ctx[4] ? 'Dark' : 'Light') + "")) set_data_dev(t4, t4_value);

    			if (/*$unlocked*/ ctx[6].switzerland || /*$LORCA_OVERRIDE*/ ctx[5]) {
    				if (if_block1) {
    					if (dirty[0] & /*$unlocked, $LORCA_OVERRIDE*/ 96) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_3(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div2, t14);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (/*$unlocked*/ ctx[6].moldyCheese || /*$LORCA_OVERRIDE*/ ctx[5]) {
    				if (if_block2) {
    					if (dirty[0] & /*$unlocked, $LORCA_OVERRIDE*/ 96) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block_2(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(div2, t15);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}

    			if (/*$unlocked*/ ctx[6].cheeseyard || /*$LORCA_OVERRIDE*/ ctx[5]) {
    				if (if_block3) {
    					if (dirty[0] & /*$unlocked, $LORCA_OVERRIDE*/ 96) {
    						transition_in(if_block3, 1);
    					}
    				} else {
    					if_block3 = create_if_block_1(ctx);
    					if_block3.c();
    					transition_in(if_block3, 1);
    					if_block3.m(div2, t16);
    				}
    			} else if (if_block3) {
    				group_outros();

    				transition_out(if_block3, 1, 1, () => {
    					if_block3 = null;
    				});

    				check_outros();
    			}

    			if (/*$unlocked*/ ctx[6].milk || /*$LORCA_OVERRIDE*/ ctx[5]) {
    				if (if_block4) {
    					if (dirty[0] & /*$unlocked, $LORCA_OVERRIDE*/ 96) {
    						transition_in(if_block4, 1);
    					}
    				} else {
    					if_block4 = create_if_block(ctx);
    					if_block4.c();
    					transition_in(if_block4, 1);
    					if_block4.m(div2, null);
    				}
    			} else if (if_block4) {
    				group_outros();

    				transition_out(if_block4, 1, 1, () => {
    					if_block4 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(devtools.$$.fragment, local);
    			transition_in(if_block0);
    			transition_in(notifications.$$.fragment, local);
    			transition_in(thoughtcomponent.$$.fragment, local);
    			transition_in(if_block1);
    			transition_in(if_block2);
    			transition_in(if_block3);
    			transition_in(if_block4);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(devtools.$$.fragment, local);
    			transition_out(if_block0);
    			transition_out(notifications.$$.fragment, local);
    			transition_out(thoughtcomponent.$$.fragment, local);
    			transition_out(if_block1);
    			transition_out(if_block2);
    			transition_out(if_block3);
    			transition_out(if_block4);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(devtools);
    			if (if_block0) if_block0.d();
    			destroy_component(notifications);
    			/*img_binding*/ ctx[9](null);
    			destroy_component(thoughtcomponent);
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    			if (if_block4) if_block4.d();
    			/*div2_binding*/ ctx[10](null);
    			/*div3_binding*/ ctx[11](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function showCredits() {
    	console.log('TODO Credit Modal');
    } // Background: https://www.svgbackgrounds.com/

    function instance($$self, $$props, $$invalidate) {
    	let $devToolsEnabled;
    	let $LORCA_OVERRIDE;
    	let $ADMIN_MODE;
    	let $unlocked;
    	validate_store(devToolsEnabled, 'devToolsEnabled');
    	component_subscribe($$self, devToolsEnabled, $$value => $$invalidate(33, $devToolsEnabled = $$value));
    	validate_store(LORCA_OVERRIDE, 'LORCA_OVERRIDE');
    	component_subscribe($$self, LORCA_OVERRIDE, $$value => $$invalidate(5, $LORCA_OVERRIDE = $$value));
    	validate_store(ADMIN_MODE, 'ADMIN_MODE');
    	component_subscribe($$self, ADMIN_MODE, $$value => $$invalidate(34, $ADMIN_MODE = $$value));
    	validate_store(unlocked, 'unlocked');
    	component_subscribe($$self, unlocked, $$value => $$invalidate(6, $unlocked = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	console.log('App.svelte');
    	let secretImage;
    	let background;
    	let gameWindow;
    	let dragWindow = null;
    	let homeComponent = null;

    	// for moving with mouse:
    	let offsetX, offsetY;

    	let clickedAtX, clickedAtY;
    	let clickedAtBackgroundPosX, clickedAtBackgroundPosY;
    	let clickedAtSecretImagePosX, clickedAtSecretImagePosY;

    	// for moving with arrow keys:
    	let gameWindowLeftInitial, gameWindowTopInitial;

    	let backgroundPosXInitial, backgroundPosYInitial;
    	let secretImageLeftInitial, secretImageTopInitial;

    	// how much slower the background moves compared to the game window
    	const backgroundParallaxRatio = 1 / 8;

    	const movingTo = {
    		right: false,
    		left: false,
    		top: false,
    		bottom: false
    	};

    	let movingWithMouse = false;
    	let isMoving = false;

    	const startTime = {
    		xLeft: null,
    		xRight: null,
    		yUp: null,
    		yDown: null
    	};

    	let unlockTogglesShown = false;
    	let isDarkMode;

    	onMount(() => {
    		homeComponent = gameWindow.querySelector('#thoughtComponent');
    		returnToHome();
    		$$invalidate(1, background.style.backgroundPositionX = '0px', background);
    		$$invalidate(1, background.style.backgroundPositionY = '0px', background);

    		// checks if dark mode is enabled in the browser:
    		$$invalidate(4, isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);

    		// sets the correct theme on the root (html) tag:
    		window.document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');

    		// return false if key is 'Enter'
    		// window.document.onkeydown = (e: KeyboardEvent) => e.key !== 'Enter'
    		window.document.addEventListener('keypress', e => {
    			if (!$ADMIN_MODE) return;
    			if (e.key === 'f') set_store_value(LORCA_OVERRIDE, $LORCA_OVERRIDE = !$LORCA_OVERRIDE, $LORCA_OVERRIDE);
    			if (e.key === 'g') set_store_value(devToolsEnabled, $devToolsEnabled = !$devToolsEnabled, $devToolsEnabled);
    			if (e.key === 'u') $$invalidate(3, unlockTogglesShown = !unlockTogglesShown);
    		});

    		window.document.addEventListener('keydown', e => {
    			if (e.key === 'ArrowRight' && !movingTo.right) movingTo.right = true;
    			if (e.key === 'ArrowLeft' && !movingTo.left) movingTo.left = true;
    			if (e.key === 'ArrowUp' && !movingTo.top) movingTo.top = true;
    			if (e.key === 'ArrowDown' && !movingTo.bottom) movingTo.bottom = true;

    			if (Object.values(movingTo).includes(true) && !isMoving) {
    				isMoving = true;
    				startTime.xLeft = null;
    				startTime.xRight = null;
    				startTime.yUp = null;
    				startTime.yDown = null;
    				requestAnimationFrame(moveWindow);
    			}
    		});

    		window.document.addEventListener('keyup', e => {
    			if (e.key === 'ArrowRight' && movingTo.right) movingTo.right = false;
    			if (e.key === 'ArrowLeft' && movingTo.left) movingTo.left = false;
    			if (e.key === 'ArrowUp' && movingTo.top) movingTo.top = false;
    			if (e.key === 'ArrowDown' && movingTo.bottom) movingTo.bottom = false;
    			if (Object.values(movingTo).every(v => v === false)) isMoving = false;
    		});

    		// drag the entire game window around freely:
    		window.document.onmousedown = e => {
    			// keep eg. sliders draggable without moving the window
    			if (e.target.classList.contains('draggable')) return;

    			movingWithMouse = true;
    			dragWindow = gameWindow;
    			clickedAtX = e.pageX;
    			clickedAtY = e.pageY;
    			offsetX = clickedAtX - gameWindow.offsetLeft;
    			offsetY = clickedAtY - gameWindow.offsetTop;
    			clickedAtBackgroundPosX = parseInt(background.style.backgroundPositionX);
    			clickedAtBackgroundPosY = parseInt(background.style.backgroundPositionY);
    			clickedAtSecretImagePosX = parseInt(secretImage.style.left);
    			clickedAtSecretImagePosY = parseInt(secretImage.style.top);
    		};

    		window.document.onmousemove = e => {
    			if (dragWindow === null) return;
    			dragWindow.style.left = e.pageX - offsetX + 'px';
    			dragWindow.style.top = e.pageY - offsetY + 'px';
    			$$invalidate(1, background.style.backgroundPositionX = clickedAtBackgroundPosX + (e.pageX - clickedAtX) * backgroundParallaxRatio + 'px', background);
    			$$invalidate(1, background.style.backgroundPositionY = clickedAtBackgroundPosY + (e.pageY - clickedAtY) * backgroundParallaxRatio + 'px', background);
    			$$invalidate(0, secretImage.style.left = clickedAtSecretImagePosX + (e.pageX - clickedAtX) * backgroundParallaxRatio + 'px', secretImage);
    			$$invalidate(0, secretImage.style.top = clickedAtSecretImagePosY + (e.pageY - clickedAtY) * backgroundParallaxRatio + 'px', secretImage);
    		};

    		window.document.onmouseup = () => {
    			movingWithMouse = false;
    			dragWindow = null;
    		};
    	});

    	function resetInitialPositionsX() {
    		gameWindowLeftInitial = gameWindow.offsetLeft;
    		secretImageLeftInitial = secretImage.offsetLeft;
    		backgroundPosXInitial = parseInt(background.style.backgroundPositionX);
    	}

    	function resetInitialPositionsY() {
    		gameWindowTopInitial = gameWindow.offsetTop;
    		secretImageTopInitial = secretImage.offsetTop;
    		backgroundPosYInitial = parseInt(background.style.backgroundPositionY);
    	}

    	function moveWindow(currentTime) {
    		if (movingWithMouse) return;

    		if (movingTo.right && !movingTo.left) {
    			if (startTime.xRight === null) {
    				resetInitialPositionsX();
    				startTime.xRight = currentTime;
    			}

    			const elapsed = currentTime - startTime.xRight;
    			$$invalidate(2, gameWindow.style.left = gameWindowLeftInitial - 1 * elapsed + 'px', gameWindow);
    			$$invalidate(0, secretImage.style.left = secretImageLeftInitial - backgroundParallaxRatio * elapsed + 'px', secretImage);
    			$$invalidate(1, background.style.backgroundPositionX = backgroundPosXInitial - backgroundParallaxRatio * elapsed + 'px', background);
    		} else {
    			startTime.xRight = null;
    		}

    		if (movingTo.left && !movingTo.right) {
    			if (startTime.xLeft === null) {
    				resetInitialPositionsX();
    				startTime.xLeft = currentTime;
    			}

    			const elapsed = currentTime - startTime.xLeft;
    			$$invalidate(2, gameWindow.style.left = gameWindowLeftInitial + 1 * elapsed + 'px', gameWindow);
    			$$invalidate(0, secretImage.style.left = secretImageLeftInitial + backgroundParallaxRatio * elapsed + 'px', secretImage);
    			$$invalidate(1, background.style.backgroundPositionX = backgroundPosXInitial + backgroundParallaxRatio * elapsed + 'px', background);
    		} else {
    			startTime.xLeft = null;
    		}

    		if (movingTo.top && !movingTo.bottom) {
    			if (startTime.yUp === null) {
    				resetInitialPositionsY();
    				startTime.yUp = currentTime;
    			}

    			const elapsed = currentTime - startTime.yUp;
    			$$invalidate(2, gameWindow.style.top = gameWindowTopInitial + 1 * elapsed + 'px', gameWindow);
    			$$invalidate(0, secretImage.style.top = secretImageTopInitial + backgroundParallaxRatio * elapsed + 'px', secretImage);
    			$$invalidate(1, background.style.backgroundPositionY = backgroundPosYInitial + backgroundParallaxRatio * elapsed + 'px', background);
    		} else {
    			startTime.yUp = null;
    		}

    		if (movingTo.bottom && !movingTo.top) {
    			if (startTime.yDown === null) {
    				resetInitialPositionsY();
    				startTime.yDown = currentTime;
    			}

    			const elapsed = currentTime - startTime.yDown;
    			$$invalidate(2, gameWindow.style.top = gameWindowTopInitial - 1 * elapsed + 'px', gameWindow);
    			$$invalidate(0, secretImage.style.top = secretImageTopInitial - backgroundParallaxRatio * elapsed + 'px', secretImage);
    			$$invalidate(1, background.style.backgroundPositionY = backgroundPosYInitial - backgroundParallaxRatio * elapsed + 'px', background);
    		} else {
    			startTime.yDown = null;
    		}

    		if (isMoving) requestAnimationFrame(moveWindow);
    	}

    	function returnToHome() {
    		if (homeComponent !== null) {
    			const gameRect = gameWindow.getBoundingClientRect();
    			const homeRect = homeComponent.getBoundingClientRect();

    			const offset = {
    				left: homeRect.left - gameRect.left,
    				top: homeRect.top - gameRect.top
    			};

    			const beforeX = gameWindow.offsetLeft;
    			const beforeY = gameWindow.offsetTop;
    			$$invalidate(2, gameWindow.style.left = `calc(50% - ${homeRect.width / 2 + offset.left}px)`, gameWindow);
    			$$invalidate(2, gameWindow.style.top = `calc(50% - ${homeRect.height / 2 + offset.top}px)`, gameWindow);
    			const afterX = gameWindow.offsetLeft;
    			const afterY = gameWindow.offsetTop;
    			$$invalidate(1, background.style.backgroundPositionX = parseInt(background.style.backgroundPositionX) + (afterX - beforeX) * backgroundParallaxRatio + 'px', background);
    			$$invalidate(1, background.style.backgroundPositionY = parseInt(background.style.backgroundPositionY) + (afterY - beforeY) * backgroundParallaxRatio + 'px', background);
    			$$invalidate(0, secretImage.style.left = parseInt(secretImage.style.left) + (afterX - beforeX) * backgroundParallaxRatio + 'px', secretImage);
    			$$invalidate(0, secretImage.style.top = parseInt(secretImage.style.top) + (afterY - beforeY) * backgroundParallaxRatio + 'px', secretImage);
    		}
    	}

    	function switchTheme() {
    		$$invalidate(4, isDarkMode = !isDarkMode);
    		window.document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    	}

    	let saveDataString;

    	function handleExport() {
    		saveDataString = exportSaveGame();
    	}

    	function handleImport() {
    		// ideally check if saveDataString is of type SaveData
    		if (saveDataString !== null) importSaveGame(saveDataString);
    	}

    	const writable_props = [];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function img_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			secretImage = $$value;
    			$$invalidate(0, secretImage);
    		});
    	}

    	function div2_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			gameWindow = $$value;
    			$$invalidate(2, gameWindow);
    		});
    	}

    	function div3_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			background = $$value;
    			$$invalidate(1, background);
    		});
    	}

    	$$self.$capture_state = () => ({
    		onMount,
    		Notifications,
    		saveSaveGame,
    		resetSaveGame,
    		exportSaveGame,
    		importSaveGame,
    		ADMIN_MODE,
    		devToolsEnabled,
    		LORCA_OVERRIDE,
    		unlocked,
    		DevTools,
    		ToggleUnlocks,
    		ThoughtComponent,
    		CheeseComponent,
    		MoldyCheeseComponent,
    		CheeseyardComponent,
    		MilkComponent,
    		MilkTreeComponent,
    		Log,
    		secretImage,
    		background,
    		gameWindow,
    		dragWindow,
    		homeComponent,
    		offsetX,
    		offsetY,
    		clickedAtX,
    		clickedAtY,
    		clickedAtBackgroundPosX,
    		clickedAtBackgroundPosY,
    		clickedAtSecretImagePosX,
    		clickedAtSecretImagePosY,
    		gameWindowLeftInitial,
    		gameWindowTopInitial,
    		backgroundPosXInitial,
    		backgroundPosYInitial,
    		secretImageLeftInitial,
    		secretImageTopInitial,
    		backgroundParallaxRatio,
    		movingTo,
    		movingWithMouse,
    		isMoving,
    		startTime,
    		unlockTogglesShown,
    		isDarkMode,
    		resetInitialPositionsX,
    		resetInitialPositionsY,
    		moveWindow,
    		returnToHome,
    		switchTheme,
    		saveDataString,
    		handleExport,
    		handleImport,
    		showCredits,
    		$devToolsEnabled,
    		$LORCA_OVERRIDE,
    		$ADMIN_MODE,
    		$unlocked
    	});

    	$$self.$inject_state = $$props => {
    		if ('secretImage' in $$props) $$invalidate(0, secretImage = $$props.secretImage);
    		if ('background' in $$props) $$invalidate(1, background = $$props.background);
    		if ('gameWindow' in $$props) $$invalidate(2, gameWindow = $$props.gameWindow);
    		if ('dragWindow' in $$props) dragWindow = $$props.dragWindow;
    		if ('homeComponent' in $$props) homeComponent = $$props.homeComponent;
    		if ('offsetX' in $$props) offsetX = $$props.offsetX;
    		if ('offsetY' in $$props) offsetY = $$props.offsetY;
    		if ('clickedAtX' in $$props) clickedAtX = $$props.clickedAtX;
    		if ('clickedAtY' in $$props) clickedAtY = $$props.clickedAtY;
    		if ('clickedAtBackgroundPosX' in $$props) clickedAtBackgroundPosX = $$props.clickedAtBackgroundPosX;
    		if ('clickedAtBackgroundPosY' in $$props) clickedAtBackgroundPosY = $$props.clickedAtBackgroundPosY;
    		if ('clickedAtSecretImagePosX' in $$props) clickedAtSecretImagePosX = $$props.clickedAtSecretImagePosX;
    		if ('clickedAtSecretImagePosY' in $$props) clickedAtSecretImagePosY = $$props.clickedAtSecretImagePosY;
    		if ('gameWindowLeftInitial' in $$props) gameWindowLeftInitial = $$props.gameWindowLeftInitial;
    		if ('gameWindowTopInitial' in $$props) gameWindowTopInitial = $$props.gameWindowTopInitial;
    		if ('backgroundPosXInitial' in $$props) backgroundPosXInitial = $$props.backgroundPosXInitial;
    		if ('backgroundPosYInitial' in $$props) backgroundPosYInitial = $$props.backgroundPosYInitial;
    		if ('secretImageLeftInitial' in $$props) secretImageLeftInitial = $$props.secretImageLeftInitial;
    		if ('secretImageTopInitial' in $$props) secretImageTopInitial = $$props.secretImageTopInitial;
    		if ('movingWithMouse' in $$props) movingWithMouse = $$props.movingWithMouse;
    		if ('isMoving' in $$props) isMoving = $$props.isMoving;
    		if ('unlockTogglesShown' in $$props) $$invalidate(3, unlockTogglesShown = $$props.unlockTogglesShown);
    		if ('isDarkMode' in $$props) $$invalidate(4, isDarkMode = $$props.isDarkMode);
    		if ('saveDataString' in $$props) saveDataString = $$props.saveDataString;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		secretImage,
    		background,
    		gameWindow,
    		unlockTogglesShown,
    		isDarkMode,
    		$LORCA_OVERRIDE,
    		$unlocked,
    		returnToHome,
    		switchTheme,
    		img_binding,
    		div2_binding,
    		div3_binding
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {}, null, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    console.log('cheeseMonster.ts');
    let accumulateSecond = 0;
    function handleCheeseMonster(resource, deltaTimeSeconds) {
        const cap = get_store_value(cheeseMonsterCapacity);
        if (resource.cheeseMonster < cap) {
            const births = get_store_value(cheeseMonsterSpawnrate) * deltaTimeSeconds;
            resource.cheeseMonster += births;
        }
        else
            resource.cheeseMonster = cap;
        const deathrate = get_store_value(cheeseMonsterDeathrate);
        if (deathrate > 0 && resource.cheeseMonster > 0) {
            if (resource.cheeseMonster > 30) {
                // for many monsters, use the statistical average deathrate
                const deaths = resource.cheeseMonster * deathrate * deltaTimeSeconds;
                resource.cheeseMonster -= deaths;
                totalCheeseMonsterDeaths.update($total => $total + deaths);
                resource.cheeseBrains += calculateMonsterLoot(deaths);
                // TODO: calculate loot on death(s)
            }
            else {
                // for just a few monsters, use random chance for deaths for variance
                accumulateSecond += deltaTimeSeconds;
                if (accumulateSecond >= 1) {
                    for (let i = 0; i < resource.cheeseMonster; i++) {
                        if (Math.random() < deathrate) {
                            resource.cheeseMonster--;
                            // TODO: calculate loot on death
                            totalCheeseMonsterDeaths.update($total => $total + 1);
                            resource.cheeseBrains += calculateMonsterLootSingle();
                        }
                    }
                    accumulateSecond = 0;
                }
            }
        }
    }
    function calculateMonsterLoot(deaths) {
        return deaths * get_store_value(cheeseMonsterLootAmount) * get_store_value(cheeseMonsterDropRate) * get_store_value(totalMonsterDeathsLootBoost);
    }
    function calculateMonsterLootSingle() {
        if (Math.random() >= get_store_value(cheeseMonsterDropRate))
            return 0;
        return 1 * get_store_value(cheeseMonsterLootAmount) * get_store_value(totalMonsterDeathsLootBoost);
    }

    console.log('gameloop.ts');
    // import {upgrades} from './upgrades'
    // natural log of 2
    const LN2 = 0.69314718056;
    lastSaved.subscribe(m => (m));
    /**
     * how often to run the loop. 200ms = 5 times per second
     * 200ms or 100ms is usually fast enough to feel responsive without wasting too much CPU time
     */
    const GAME_INTERVAL = 200;
    const fastFowardFactor = 1;
    /**
     * This function will start the game loop running at the desired rate, and save a reference to the interval so it can be stopped later
     */
    function startGameLoop() {
        console.log('Starting the game loop...');
        setInterval(gameLoop, GAME_INTERVAL);
    }
    // some datetime values we will be using to calculate how much time has passed
    let lastRunTime = Date.now();
    /**
     * the time difference in seconds since the last time the loop ran
     */
    let deltaTimeSeconds = 0;
    /**
     * The game loop function that runs multiple times per second in the background.
     */
    function gameLoop() {
        const currentTime = Date.now();
        // calculate deltaT based on the current time and the last run time
        // we are using Math.max and Math.min to make sure deltaT is between 0 and 1 seconds
        deltaTimeSeconds = Math.max(Math.min((currentTime - lastRunTime) / 1000, 1), 0);
        lastRunTime = currentTime;
        // Now we know what deltaT is we can update the game
        gameUpdate(deltaTimeSeconds);
    }
    /**
     * Function to update all game data based on time.
     * This is where all idle calculations should start so they can be
     * used by the main loop and the offline progress function.
     * (Assumes that the production can be linearly extrapolated)
     * @param deltaTimeSeconds time in seconds since last update
     */
    function gameUpdate(deltaTimeSeconds) {
        deltaTimeSeconds *= fastFowardFactor;
        resource.update($resource => {
            $resource.thoughts += get_store_value(thoughtsPerSec) * deltaTimeSeconds;
            // moldy cheese decay (linear extrapolation)
            // moldyCheese.update(value => value * (1 - LN2/get(mcHalfLifeSeconds) * deltaTimeSeconds))
            // OR: moldy cheese decay (exact)
            // if statement so while offline for longer than 10s you dont lose moldy cheese (?)
            $resource.moldyCheese *= Math.exp((-LN2 * deltaTimeSeconds) / get_store_value(mcHalfLifeSeconds));
            handleCheeseMonster($resource, deltaTimeSeconds);
            if ($resource.milk > get_store_value(highestMilk))
                highestMilk.set($resource.milk);
            $resource.milkPower += get_store_value(milkPowerPerSec) * deltaTimeSeconds;
            return $resource;
        });
        totalTimePlayed.update($value => $value + deltaTimeSeconds);
        // upgradesBought.update(value => value)
    }
    /* function repopulateValues() {
      for (let id in upgrades) {
        upgrades[id].cost *= Math.pow(upgrades[id].costMultiplier, get(upgradesBought)[id])
      }
    } */

    console.log('main.ts');
    const app = new App({
        target: document.body,
    });
    /**
     *  Start the game loop in the background
     * 	This also calculates the offline progress
     */
    startGameLoop();

    return app;

})();
//# sourceMappingURL=bundle.js.map
